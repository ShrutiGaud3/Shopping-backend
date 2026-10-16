const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  // Type: 'percent' or 'flat' (and 'percentage' / 'fixed' for backward compatibility)
  type: {
    type: String,
    enum: ['percent', 'flat', 'percentage', 'fixed'],
    default: 'percent'
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'percent', 'flat'],
    default: 'percentage'
  },
  // Discount value (percentage value e.g. 10 for 10% or flat amount in INR)
  value: {
    type: Number,
    min: 0,
    default: 10
  },
  discountValue: {
    type: Number,
    min: 0,
    default: 10
  },
  minOrder: {
    type: Number,
    default: 0
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: 1000
  },
  maximumDiscount: {
    type: Number,
    default: 1000
  },
  expiry: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
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
  // Restrict to specific payment method: 'any', 'prepaid', or 'cod'
  paymentMethod: {
    type: String,
    enum: ['any', 'prepaid', 'cod'],
    default: 'any'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save synchronization hook to maintain 100% backward & forward compatibility
couponSchema.pre('save', function (next) {
  // Sync type & discountType
  if (this.type === 'percent') this.discountType = 'percentage';
  else if (this.type === 'flat') this.discountType = 'fixed';
  else if (this.discountType === 'percentage') this.type = 'percent';
  else if (this.discountType === 'fixed') this.type = 'flat';

  // Sync value & discountValue
  if (this.value !== undefined && this.discountValue === undefined) this.discountValue = this.value;
  if (this.discountValue !== undefined && this.value === undefined) this.value = this.discountValue;

  // Sync minOrder & minimumOrderValue
  if (this.minOrder !== undefined && this.minimumOrderValue === undefined) this.minimumOrderValue = this.minOrder;
  if (this.minimumOrderValue !== undefined && this.minOrder === undefined) this.minOrder = this.minimumOrderValue;

  // Sync maxDiscount & maximumDiscount
  if (this.maxDiscount !== undefined && this.maximumDiscount === undefined) this.maximumDiscount = this.maxDiscount;
  if (this.maximumDiscount !== undefined && this.maxDiscount === undefined) this.maxDiscount = this.maximumDiscount;

  // Sync expiry & expiryDate
  if (this.expiry && !this.expiryDate) this.expiryDate = this.expiry;
  if (this.expiryDate && !this.expiry) this.expiry = this.expiryDate;

  next();
});

module.exports = mongoose.model('Coupon', couponSchema);

