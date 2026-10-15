const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide FAQ question'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Please provide FAQ answer'],
    trim: true
  },
  category: {
    type: String,
    enum: ['General', 'Shipping & Delivery', 'Returns & Exchange', 'Orders & Payment', 'Sizing & Customization'],
    default: 'General'
  },
  order: {
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

module.exports = mongoose.model('Faq', faqSchema);
