const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// Seed default initial coupons if collection is empty or missing PREPAID10
const seedInitialCoupons = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.create([
        {
          code: 'PREPAID10',
          type: 'percent',
          value: 10,
          minOrder: 0,
          maxDiscount: 500,
          paymentMethod: 'prepaid',
          isActive: true
        },
        {
          code: 'WELCOME100',
          type: 'flat',
          value: 100,
          minOrder: 999,
          maxDiscount: 100,
          paymentMethod: 'any',
          isActive: true
        },
        {
          code: 'SURATFESTIVE',
          type: 'percent',
          value: 15,
          minOrder: 1499,
          maxDiscount: 750,
          paymentMethod: 'any',
          isActive: true
        },
        {
          code: 'BRIDAL20',
          type: 'percent',
          value: 20,
          minOrder: 2999,
          maxDiscount: 1500,
          paymentMethod: 'any',
          isActive: true
        }
      ]);
      console.log('[Coupons] Default promotional coupons successfully seeded.');
    } else {
      const prepaidExists = await Coupon.findOne({ code: 'PREPAID10' });
      if (!prepaidExists) {
        await Coupon.create({
          code: 'PREPAID10',
          type: 'percent',
          value: 10,
          minOrder: 0,
          maxDiscount: 500,
          paymentMethod: 'prepaid',
          isActive: true
        });
        console.log('[Coupons] Seeded missing PREPAID10 coupon.');
      }
    }
  } catch (err) {
    console.error('[Coupons] Seed error:', err.message);
  }
};

// Immediately check & seed
seedInitialCoupons();

// @desc    Validate promotional coupon code
// @route   POST /api/coupons/validate and POST /api/coupons/apply
// @access  Public
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0, email, paymentMethod } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Please enter a coupon code'
      });
    }

    const uppercaseCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: uppercaseCode, isActive: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: `Coupon code '${uppercaseCode}' is invalid or deactivated`
      });
    }

    // 1. Expiry Check
    const expiry = coupon.expiry || coupon.expiryDate;
    if (expiry && new Date() > new Date(expiry)) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon code '${uppercaseCode}' has expired`
      });
    }

    // 2. Global Usage Limit Check
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon code '${uppercaseCode}' has reached its maximum global redemption limit`
      });
    }

    // 3. User Specific Single Usage Check (User ID or Customer Email)
    const currentUser = req.user;
    const userEmail = currentUser?.email || email;

    const queryConditions = [];
    if (currentUser && currentUser._id) {
      queryConditions.push({ user: currentUser._id });
    }
    if (userEmail) {
      queryConditions.push({ customerEmail: userEmail });
    }

    if (queryConditions.length > 0) {
      const existingOrder = await Order.findOne({
        couponCode: uppercaseCode,
        $or: queryConditions
      });

      if (existingOrder) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: `You have already redeemed coupon '${uppercaseCode}' on previous order #${existingOrder.orderId}`
        });
      }
    }

    // 4. Minimum Order Value Check
    const minOrderVal = coupon.minOrder !== undefined ? coupon.minOrder : (coupon.minimumOrderValue || 0);
    if (Number(cartTotal) < minOrderVal) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Minimum order value of ₹${minOrderVal} required for coupon '${uppercaseCode}'`
      });
    }

    // 5. Payment Method Compatibility Check
    const couponMethod = coupon.paymentMethod || 'any';
    if (paymentMethod) {
      const isCod = paymentMethod.toUpperCase() === 'COD';
      const isPrepaid = !isCod;

      if (couponMethod === 'prepaid' && isCod) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: `Coupon '${uppercaseCode}' is exclusively valid for Prepaid / Online orders (UPI / Card). Switch to Online payment to avail this discount.`
        });
      }

      if (couponMethod === 'cod' && isPrepaid) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: `Coupon '${uppercaseCode}' is only applicable for Cash on Delivery (COD) orders.`
        });
      }
    }

    // 6. Calculate Final Discount Amount
    const isPercent = coupon.type === 'percent' || coupon.discountType === 'percentage';
    const discVal = coupon.value !== undefined ? coupon.value : (coupon.discountValue || 0);
    const maxDiscount = coupon.maxDiscount !== undefined ? coupon.maxDiscount : (coupon.maximumDiscount || 1000);

    let discount = 0;
    if (isPercent) {
      discount = Math.min((Number(cartTotal) * discVal) / 100, maxDiscount);
    } else {
      discount = Math.min(discVal, Number(cartTotal));
    }

    discount = Math.round(discount);

    res.status(200).json({
      success: true,
      valid: true,
      code: coupon.code,
      type: isPercent ? 'percent' : 'flat',
      value: discVal,
      paymentMethod: couponMethod,
      discount,
      message: `Coupon '${coupon.code}' applied! You save ₹${discount.toLocaleString('en-IN')}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all coupons (Admin Only)
// @route   GET /api/admin/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new coupon (Admin Only)
// @route   POST /api/admin/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      discountType,
      value,
      discountValue,
      discountPercentage,
      minOrder,
      minOrderAmount,
      minimumOrderValue,
      maxDiscount,
      maxDiscountAmount,
      maximumDiscount,
      expiry,
      expiryDate,
      usageLimit,
      paymentMethod = 'any',
      isActive = true
    } = req.body;

    const normalizedType = type || (discountType === 'fixed' ? 'flat' : 'percent');
    const normalizedValue = Number(value !== undefined ? value : (discountValue !== undefined ? discountValue : (discountPercentage || 10)));
    const normalizedMinOrder = Number(minOrder !== undefined ? minOrder : (minOrderAmount !== undefined ? minOrderAmount : (minimumOrderValue || 0)));
    const normalizedMaxDiscount = Number(maxDiscount !== undefined ? maxDiscount : (maxDiscountAmount !== undefined ? maxDiscountAmount : (maximumDiscount || 1000)));
    const normalizedExpiry = expiry || expiryDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    const coupon = new Coupon({
      code: (code || '').trim().toUpperCase(),
      type: normalizedType,
      discountType: normalizedType === 'flat' ? 'fixed' : 'percentage',
      value: normalizedValue,
      discountValue: normalizedValue,
      minOrder: normalizedMinOrder,
      minimumOrderValue: normalizedMinOrder,
      maxDiscount: normalizedMaxDiscount,
      maximumDiscount: normalizedMaxDiscount,
      expiry: normalizedExpiry,
      expiryDate: normalizedExpiry,
      usageLimit: Number(usageLimit || 1000),
      paymentMethod,
      isActive: Boolean(isActive)
    });

    const createdCoupon = await coupon.save();
    res.status(201).json({
      success: true,
      message: `Coupon '${createdCoupon.code}' created successfully`,
      data: createdCoupon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update coupon (Admin Only)
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    Object.assign(coupon, req.body);
    const updated = await coupon.save();

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete coupon (Admin Only)
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
