const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    lowercase: true,
    trim: true
  },
  orderNumber: {
    type: String,
    default: ''
  },
  topic: {
    type: String,
    default: 'Order Inquiry'
  },
  message: {
    type: String,
    required: [true, 'Please provide your message'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Replied', 'Resolved'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
