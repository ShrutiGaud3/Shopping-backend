const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const generateOrderId = require('../utils/generateOrderId');

// @desc    Create new customer order (Checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD', couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // 1. Verify items & calculate subtotal
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prodId = item.product || item.id;
      let dbProduct = null;

      if (prodId && mongoose.Types.ObjectId.isValid(prodId)) {
        dbProduct = await Product.findById(prodId);
      }

      if (!dbProduct && item.name) {
        dbProduct = await Product.findOne({ name: item.name });
      }

      if (dbProduct) {
        const itemPrice = Number(item.price || dbProduct.price || 1299);
        subtotal += itemPrice * Number(item.quantity || 1);

        verifiedItems.push({
          product: dbProduct._id,
          name: dbProduct.name,
          image: (dbProduct.images && dbProduct.images[0]) || item.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
          price: itemPrice,
          quantity: Number(item.quantity || 1),
          size: item.size || 'M',
          color: item.color || 'Default'
        });
      } else {
        const itemPrice = Number(item.price || 1299);
        subtotal += itemPrice * Number(item.quantity || 1);

        verifiedItems.push({
          name: item.name || 'Fashion Item',
          image: item.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
          price: itemPrice,
          quantity: Number(item.quantity || 1),
          size: item.size || 'M',
          color: item.color || 'Default'
        });
      }
    }

    // 2. Validate coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (subtotal >= coupon.minimumOrderValue) {
          if (coupon.discountType === 'percentage') {
            discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maximumDiscount);
          } else {
            discount = coupon.discountValue;
          }
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const shippingCharge = subtotal > 999 ? 0 : 99;
    const tax = 0;
    const totalAmount = Math.max(0, subtotal - discount + shippingCharge);

    const customerName = shippingAddress?.fullName || req.user?.name || 'Customer';
    const customerEmail = req.user?.email || 'customer@example.com';

    // 3. Create Order
    const order = new Order({
      orderId: generateOrderId(),
      user: req.user ? req.user._id : undefined,
      customerName,
      customerEmail,
      items: verifiedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
      orderStatus: 'Confirmed',
      subtotal,
      discount,
      shippingCharge,
      tax,
      totalAmount,
      couponCode: couponCode || ''
    });

    const createdOrder = await order.save();

    // 4. Decrement product stock levels in MongoDB Atlas (Clamped to minimum 0)
    for (const item of verifiedItems) {
      if (item.product) {
        const prodDoc = await Product.findById(item.product);
        if (prodDoc) {
          prodDoc.stock = Math.max(0, (prodDoc.stock || 0) - item.quantity);
          await prodDoc.save();
        }
      }
    }

    // 5. Clear user cart after successful checkout
    if (req.user) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: createdOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
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
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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

// @desc    Update order status (Admin Only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
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

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'paid';
    }
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
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
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
};
