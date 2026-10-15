const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    let queryId = productId;

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      queryId = productId;
    } else {
      const dbProduct = await Product.findOne({ $or: [{ _id: productId }, { name: productId }] });
      if (dbProduct) queryId = dbProduct._id;
    }

    const reviews = await Review.find({ product: queryId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a product review
// @route   POST /api/products/:productId/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    let dbProduct = null;
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      dbProduct = await Product.findById(productId);
    }
    if (!dbProduct) {
      dbProduct = await Product.findOne({ name: productId });
    }
    if (!dbProduct) {
      dbProduct = await Product.findOne();
    }

    if (!dbProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: dbProduct._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = new Review({
      user: req.user._id,
      userName: req.user.name,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      userLocation: 'India',
      product: dbProduct._id,
      productName: dbProduct.name,
      rating: Number(rating),
      comment,
      isVerifiedPurchase: true
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Ensure user owns review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average rating
    await Review.calculateAverageRating(productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all customer reviews (All products)
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(30);
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProductReviews,
  getAllReviews,
  createProductReview,
  deleteReview
};
