const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: ''
  },
  userLocation: {
    type: String,
    default: 'India'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: [true, 'Please select rating from 1 to 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  comment: {
    type: String,
    required: [true, 'Please provide review comment'],
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  isVerifiedBuyer: {
    type: Boolean,
    default: true
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  helpfulVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate average product rating static method for approved reviews only
reviewSchema.statics.calculateAverageRating = async function(productId) {
  try {
    const objectId = typeof productId === 'string' ? new mongoose.Types.ObjectId(productId) : productId;
    const stats = await this.aggregate([
      { $match: { product: objectId, status: 'approved' } },
      {
        $group: {
          _id: '$product',
          reviewsCount: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const Product = mongoose.models.Product || require('./Product');
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(objectId, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
        reviewsCount: stats[0].reviewsCount
      });
    } else {
      await Product.findByIdAndUpdate(objectId, {
        rating: 0,
        reviewsCount: 0
      });
    }
  } catch (err) {
    console.error(`Error recalculating rating for product ${productId}:`, err);
  }
};

// Recalculate average rating after save/remove
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
