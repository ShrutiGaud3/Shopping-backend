const mongoose = require('mongoose');

const homeSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      default: '',
      trim: true
    },
    type: {
      type: String,
      enum: ['story_circles', 'product_grid', 'banner_grid', 'campaign_banner', 'bestselling_categories'],
      default: 'product_grid',
      required: true
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    config: {
      filterBy: {
        type: String,
        enum: ['trending', 'deal', 'new', 'category', 'all'],
        default: 'trending'
      },
      category: {
        type: String,
        default: ''
      },
      limit: {
        type: Number,
        default: 8
      },
      description: {
        type: String,
        default: ''
      },
      secondaryCtaText: {
        type: String,
        default: ''
      },
      secondaryCtaLink: {
        type: String,
        default: ''
      },
      banners: [
        {
          image: { type: String, default: '' },
          title: { type: String, default: '' },
          subtitle: { type: String, default: '' },
          link: { type: String, default: '/products' },
          badge: { type: String, default: '' },
          tag: { type: String, default: '' },
          description: { type: String, default: '' }
        }
      ],
      ctaText: {
        type: String,
        default: 'Explore All'
      },
      ctaLink: {
        type: String,
        default: '/products'
      },
      bgColor: {
        type: String,
        default: ''
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('HomeSection', homeSectionSchema);
