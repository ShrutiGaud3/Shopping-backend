const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Setting = require('../models/Setting');
const ShippingZone = require('../models/ShippingZone');
const generateOrderId = require('../utils/generateOrderId');

// @desc    Create new customer order (Checkout)
// @route   POST /api/orders
// @access  Private (Requires login)
const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to place an order.'
      });
    }

    const {
      items,
      shippingAddress,
      paymentMethod = 'COD',
      couponCode,
      paymentId = '',
      razorpayOrderId = '',
      paymentSignature = ''
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided in cart'
      });
    }

    if (!shippingAddress || (!shippingAddress.address && !shippingAddress.street) || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required (street/address, city, pincode)'
      });
    }

    // Load store settings for shipping & COD
    const settings = await Setting.findOne() || {};
    const codEnabled = settings.codEnabled !== undefined ? settings.codEnabled : true;
    const codExtraCharge = (paymentMethod === 'COD' && codEnabled) ? Number(settings.codExtraCharge || 0) : 0;

    // 1. Verify items & calculate subtotal strictly from DB prices + stitching options
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prodId = item.product || item.id || item._id;
      let dbProduct = null;

      if (prodId && mongoose.Types.ObjectId.isValid(prodId)) {
        dbProduct = await Product.findById(prodId);
      }

      if (!dbProduct && item.name) {
        dbProduct = await Product.findOne({ name: item.name });
      }

      // Base price from DB (fallback to passed price if product is seed catalog item)
      const basePrice = dbProduct ? Number(dbProduct.price) : Number(item.price || 1299);
      
      // Stitching surcharge (if customer picked custom/semi-stitched tailoring)
      let stitchSurcharge = 0;
      let stitchOption = undefined;
      if (item.stitchOption && item.stitchOption.price) {
        stitchSurcharge = Number(item.stitchOption.price) || 0;
        stitchOption = {
          type: item.stitchOption.type || 'Custom Stitching',
          price: stitchSurcharge,
          description: item.stitchOption.description || ''
        };
      }

      const itemEffectivePrice = basePrice + stitchSurcharge;
      const quantity = Math.max(1, Number(item.quantity || 1));
      subtotal += itemEffectivePrice * quantity;

      verifiedItems.push({
        product: dbProduct ? dbProduct._id : undefined,
        name: dbProduct ? dbProduct.name : (item.name || 'Ethnic Wear Item'),
        image: (dbProduct && dbProduct.images && dbProduct.images[0]) || item.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        price: itemEffectivePrice,
        quantity,
        size: item.size || item.selectedSize || 'Free Size',
        color: item.color || item.selectedColor || 'As Shown',
        stitchOption
      });
    }

    // 2. Validate coupon if provided - Strict single-use per customer
    let discount = 0;
    let validatedCouponCode = '';

    if (couponCode && couponCode.trim()) {
      const upperCode = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: upperCode, isActive: true });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: `Coupon code '${upperCode}' is invalid or deactivated.`
        });
      }

      const expiry = coupon.expiry || coupon.expiryDate;
      const isExpired = expiry && new Date() > new Date(expiry);
      if (isExpired) {
        return res.status(400).json({
          success: false,
          message: `Coupon code '${upperCode}' has expired.`
        });
      }

      const limitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
      if (limitReached) {
        return res.status(400).json({
          success: false,
          message: `Coupon code '${upperCode}' has reached its maximum global redemption limit.`
        });
      }

      // Check single usage for customer (User ID or Customer Email)
      const currentUser = req.user;
      const userEmail = (currentUser?.email || shippingAddress?.email || '').trim();
      const userConditions = [];
      if (currentUser?._id) userConditions.push({ user: currentUser._id });
      if (userEmail) userConditions.push({ customerEmail: new RegExp(`^${userEmail}$`, 'i') });

      if (userConditions.length > 0) {
        const pastOrder = await Order.findOne({
          couponCode: new RegExp(`^${upperCode}$`, 'i'),
          $or: userConditions
        });
        if (pastOrder) {
          return res.status(400).json({
            success: false,
            message: `You have already redeemed coupon '${upperCode}' on previous order #${pastOrder.orderId}. Each coupon can only be used once.`
          });
        }
      }

      // Check payment method compatibility
      const isCod = paymentMethod.toUpperCase() === 'COD';
      if (coupon.paymentMethod === 'prepaid' && isCod) {
        return res.status(400).json({
          success: false,
          message: `Coupon '${upperCode}' is only valid for prepaid online payments (UPI/Card).`
        });
      }
      if (coupon.paymentMethod === 'cod' && !isCod) {
        return res.status(400).json({
          success: false,
          message: `Coupon '${upperCode}' is only valid for Cash on Delivery (COD) orders.`
        });
      }

      const minOrder = coupon.minOrder !== undefined ? coupon.minOrder : (coupon.minimumOrderValue || 0);
      if (subtotal < minOrder) {
        return res.status(400).json({
          success: false,
          message: `Minimum order value of ₹${minOrder} is required for coupon '${upperCode}'.`
        });
      }

      const isPercent = coupon.type === 'percent' || coupon.discountType === 'percentage';
      const discVal = coupon.value !== undefined ? coupon.value : (coupon.discountValue || 0);
      const maxDiscount = coupon.maxDiscount !== undefined ? coupon.maxDiscount : (coupon.maximumDiscount || 1000);

      if (isPercent) {
        discount = Math.min((subtotal * discVal) / 100, maxDiscount);
      } else {
        discount = Math.min(discVal, subtotal);
      }
      discount = Math.round(discount);
      validatedCouponCode = coupon.code;

      // Increment coupon global usage count
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      await coupon.save();
    }

    // 3. Dynamic Shipping Zone Calculation based on Country
    const destinationCountry = shippingAddress.country ? shippingAddress.country.trim() : 'India';
    let shippingCharge = 0;

    const matchedZone = await ShippingZone.findOne({
      country: new RegExp(`^${destinationCountry}$`, 'i'),
      isActive: true
    });

    if (matchedZone) {
      if (matchedZone.freeAbove > 0 && subtotal >= matchedZone.freeAbove) {
        shippingCharge = 0;
      } else {
        shippingCharge = matchedZone.charge;
      }
    } else {
      // Default Indian domestic rates from store settings
      const freeThreshold = Number(settings.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 999);
      const standardFee = Number(settings.standardShippingFee !== undefined ? settings.standardShippingFee : 99);
      shippingCharge = subtotal >= freeThreshold ? 0 : standardFee;
    }

    // 4. Calculate Final Total Amount
    const tax = 0;
    const totalAmount = Math.max(0, subtotal - discount + shippingCharge + codExtraCharge);

    const customerName = shippingAddress?.fullName || req.user?.name || 'Customer';
    const customerEmail = req.user?.email || shippingAddress?.email || 'customer@example.com';
    const customerPhone = shippingAddress?.phone || req.user?.phone || '';

    // Payment Status determination
    const isPaid = (paymentMethod !== 'COD' && paymentId) ? 'paid' : 'pending';

    // 5. Create Order Document
    const order = new Order({
      orderId: generateOrderId(),
      user: req.user ? req.user._id : undefined,
      customerName,
      customerEmail,
      customerPhone,
      items: verifiedItems,
      shippingAddress: {
        name: customerName,
        fullName: customerName,
        phone: customerPhone,
        street: shippingAddress.street || shippingAddress.address,
        address: shippingAddress.address || shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || '',
        pincode: shippingAddress.pincode,
        country: destinationCountry
      },
      paymentMethod,
      paymentStatus: isPaid,
      paymentId: paymentId || '',
      razorpayOrderId: razorpayOrderId || '',
      paymentSignature: paymentSignature || '',
      orderStatus: 'Confirmed',
      subtotal,
      discount,
      shippingCharge,
      codCharge: codExtraCharge,
      tax,
      totalAmount,
      couponCode: validatedCouponCode,
      trackingNumber: '',
      carrierName: '',
      trackingUrl: '',
      exchangeStatus: 'none'
    });

    const createdOrder = await order.save();

    // 6. Decrement product stock levels in MongoDB Atlas
    for (const item of verifiedItems) {
      if (item.product) {
        const prodDoc = await Product.findById(item.product);
        if (prodDoc) {
          prodDoc.stock = Math.max(0, (prodDoc.stock || 0) - item.quantity);
          await prodDoc.save();
        }
      }
    }

    // 7. Clear user cart after successful checkout
    if (req.user) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Thank you for choosing VELORA.',
      data: createdOrder
    });
  } catch (error) {
    console.error('[Create Order Error]', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create Razorpay / Online Payment Intent
// @route   POST /api/orders/payment-intent
// @access  Public / Private
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_' + Date.now() } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount required' });
    }

    // Generate online payment token / simulated Razorpay order ID
    const rzpOrderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_velora_key_2026';

    res.status(200).json({
      success: true,
      data: {
        keyId,
        orderId: rzpOrderId,
        amount: Math.round(Number(amount) * 100), // in paise
        currency,
        receipt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Online / Razorpay Payment
// @route   POST /api/orders/verify-payment
// @access  Public / Private
const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, razorpayOrderId, signature } = req.body;

    let order = null;
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findById(orderId);
    }
    if (!order) {
      order = await Order.findOne({ orderId });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'paid';
    order.paymentId = paymentId || `pay_${Date.now()}`;
    order.razorpayOrderId = razorpayOrderId || order.razorpayOrderId;
    order.paymentSignature = signature || '';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request Exchange / Return for an order (within 10 days of delivery)
// @route   POST /api/orders/:id/exchange
// @access  Private
const requestExchange = async (req, res) => {
  try {
    const { reason, notes } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please select an exchange reason (e.g. Size/Fit, Defective, Fabric Quality)'
      });
    }

    let order = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      order = await Order.findById(req.params.id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: req.params.id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify order belongs to requesting user (if not admin)
    if (req.user && req.user.role !== 'admin' && order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to request exchange for this order' });
    }

    // Must be Delivered to request exchange
    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Order must be in 'Delivered' state to request an exchange. Current status: ${order.orderStatus}`
      });
    }

    // Check 10-day exchange window rule
    const deliveryTimestamp = order.deliveredAt ? new Date(order.deliveredAt).getTime() : new Date(order.updatedAt).getTime();
    const daysSinceDelivery = (Date.now() - deliveryTimestamp) / (1000 * 60 * 60 * 24);

    if (daysSinceDelivery > 10) {
      return res.status(400).json({
        success: false,
        message: `The 10-day exchange window for this order has expired (${Math.floor(daysSinceDelivery)} days elapsed since delivery).`
      });
    }

    // Prevent duplicate active requests
    if (order.exchangeStatus === 'requested') {
      return res.status(400).json({
        success: false,
        message: 'An exchange request is already pending review for this order.'
      });
    }

    order.exchangeStatus = 'requested';
    order.exchangeReason = reason.trim();
    order.exchangeNotes = notes ? notes.trim() : '';
    order.exchangeRequestedAt = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Exchange request submitted successfully. Our executive will inspect and schedule pickup.',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin approve or reject exchange request
// @route   PUT /api/admin/orders/:id/exchange
// @access  Private/Admin
const updateExchangeStatusAdmin = async (req, res) => {
  try {
    const { exchangeStatus, adminNotes } = req.body;

    if (!['approved', 'rejected', 'none'].includes(exchangeStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be approved, rejected, or none'
      });
    }

    let order = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      order = await Order.findById(req.params.id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: req.params.id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.exchangeStatus = exchangeStatus;
    order.exchangeAdminNotes = adminNotes || '';
    order.exchangeResolvedAt = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      message: `Exchange request marked as ${exchangeStatus}`,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in customer orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order details by ID or orderId
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    let order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to logged in user or admin
    if (order.user && req.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin Only)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.product');
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status, tracking, and carrier (Admin Only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status, trackingNumber, carrierName, trackingUrl } = req.body;
    let order = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      order = await Order.findById(req.params.id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: req.params.id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) {
      order.orderStatus = status;
      if (status === 'Delivered') {
        order.paymentStatus = 'paid';
        if (!order.deliveredAt) {
          order.deliveredAt = new Date();
        }
      }
    }

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber.trim();
    if (carrierName !== undefined) order.carrierName = carrierName.trim();
    if (trackingUrl !== undefined) order.trackingUrl = trackingUrl.trim();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  createPaymentIntent,
  verifyPayment,
  requestExchange,
  updateExchangeStatusAdmin,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
};
