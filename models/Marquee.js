const mongoose = require('mongoose');

const marqueeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide marquee text content'],
    trim: true
  },
  link: {
    type: String,
    default: '/products'
  },
  icon: {
    type: String,
    default: 'Sparkles' // e.g. 'Truck', 'Sparkles', 'RotateCcw', 'ShieldCheck'
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

module.exports = mongoose.model('Marquee', marqueeSchema);
