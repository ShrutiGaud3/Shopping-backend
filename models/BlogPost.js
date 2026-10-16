const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide blog title'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide cover image URL']
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide short summary / excerpt'],
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: [true, 'Please provide blog content']
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    default: 'Ethnic Fashion & Heritage',
    trim: true
  },
  author: {
    name: { type: String, default: 'SuratiKart Style Team' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    role: { type: String, default: 'Senior Fashion & Handloom Curator' }
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: [{ type: String, trim: true }]
  }
}, {
  timestamps: true
});

// Auto-generate slug from title before validation if not present
blogPostSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
