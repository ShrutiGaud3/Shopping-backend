const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      default: '',
      trim: true
    },
    badge: {
      type: String,
      default: '',
      trim: true
    },
    desktopImage: {
      type: String,
      required: [true, 'Desktop banner image URL is required'],
      trim: true
    },
    mobileImage: {
      type: String,
      default: '',
      trim: true
    },
    ctaText: {
      type: String,
      default: 'Shop Collection',
      trim: true
    },
    ctaLink: {
      type: String,
      default: '/products',
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    textColor: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    alignment: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'left'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
