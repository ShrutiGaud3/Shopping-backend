const mongoose = require('mongoose');

const trustBadgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Badge title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      default: '',
      trim: true
    },
    icon: {
      type: String,
      enum: ['shield', 'truck', 'creditCard', 'rotate', 'sparkles', 'check'],
      default: 'shield'
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TrustBadge', trustBadgeSchema);
