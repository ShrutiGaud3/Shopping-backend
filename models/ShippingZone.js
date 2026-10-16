const mongoose = require('mongoose');

const shippingZoneSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Please provide country name'],
    unique: true,
    trim: true
  },
  countryCode: {
    type: String,
    trim: true,
    uppercase: true,
    default: 'IN'
  },
  charge: {
    type: Number,
    required: [true, 'Please specify shipping charge'],
    min: 0,
    default: 0
  },
  freeAbove: {
    type: Number,
    min: 0,
    default: 0 // 0 means no free shipping limit, or free if charge is 0
  },
  estimatedDays: {
    type: String,
    default: '3-5 Business Days'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShippingZone', shippingZoneSchema);
