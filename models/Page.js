const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide page title'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Please provide page slug'],
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide page content'],
    default: ''
  },
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Page', pageSchema);
