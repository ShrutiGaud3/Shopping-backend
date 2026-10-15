const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// @desc    Validate promotional coupon code
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0, email } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a coupon code'
      });
    }

    const uppercaseCode = code.toUpperCase();
    const coupon = await Coupon.findOne({ code: uppercaseCode, isActive: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid or expired coupon code'
      });
    }

    // Check expiry
    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Coupon code has expired'
      });
    }

    // Check overall usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Coupon usage limit reached'
      });
    }

    // Check single usage limit per user (by User ID or Email)
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
          message: `You have already used coupon code '${uppercaseCode}' on a previous order.`
        });
      }
    }

    // Check minimum order value
    if (cartTotal < coupon.minimumOrderValue) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Minimum order value of ₹${coupon.minimumOrderValue} required for this coupon`
      });
    }

    // Calculate discount amount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.min((cartTotal * coupon.discountValue) / 100, coupon.maximumDiscount);
    } else {
      discount = Math.min(coupon.discountValue, cartTotal);
    }

    res.status(200).json({
      success: true,
      valid: true,
      code: coupon.code,
      discount,
      message: `Coupon '${coupon.code}' applied! Savings: ₹${discount}`
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
    const coupon = new Coupon(req.body);
    const createdCoupon = await coupon.save();
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: createdCoupon
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
    await Coupon.findByIdAndDelete(req.params.id);
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
  deleteCoupon
};
