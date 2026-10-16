const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide category name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  gender: {
    type: String,
    enum: ['Women', 'Men', 'Kids', 'All'],
    default: 'All'
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  itemCount: {
    type: Number,
    default: 0
  },
  // Hierarchy & Tree for Dynamic Mega Menu
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  showInMenu: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: ['category', 'occasion', 'festival', 'collection'],
    default: 'category'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ showInMenu: 1, isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);
