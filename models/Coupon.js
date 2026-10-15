const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Please specify discount value'],
    min: 0
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  maximumDiscount: {
    type: Number,
    default: 1000
  },
  expiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  },
  usageLimit: {
    type: Number,
    default: 1000
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
