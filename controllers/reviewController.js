const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get approved reviews for a product with rating statistics
// @route   GET /api/products/:productId/reviews or GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    let queryId = null;

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      queryId = new mongoose.Types.ObjectId(productId);
    } else {
      const dbProduct = await Product.findOne({ $or: [{ _id: productId }, { slug: productId }, { name: productId }] });
      if (dbProduct) queryId = dbProduct._id;
    }

    if (!queryId) {
      return res.status(200).json({
        success: true,
        data: [],
        stats: {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      });
    }

    // Only return approved reviews for customers
    const reviews = await Review.find({ product: queryId, status: 'approved' })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    // Calculate rating statistics & distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;
    const photoReviews = [];

    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[star] = (distribution[star] || 0) + 1;
      ratingSum += r.rating;
      if (r.images && r.images.length > 0) {
        photoReviews.push(...r.images);
      }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? Math.round((ratingSum / totalReviews) * 10) / 10 : 0;

    res.status(200).json({
      success: true,
      data: reviews,
      stats: {
        averageRating,
        totalReviews,
        distribution,
        photoReviewsCount: photoReviews.length,
        photoGallery: photoReviews.slice(0, 12)
      }
    });
  } catch (error) {
    console.error('Error in getProductReviews:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if logged in user is eligible to review product (verified buyer check)
// @route   GET /api/reviews/check-eligibility/:productId
// @access  Private
const checkEligibility = async (req, res) => {
  try {
    const { productId } = req.params;
    let queryId = null;

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      queryId = new mongoose.Types.ObjectId(productId);
    } else {
      const dbProduct = await Product.findOne({ $or: [{ _id: productId }, { slug: productId }, { name: productId }] });
      if (dbProduct) queryId = dbProduct._id;
    }

    if (!queryId) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: queryId
    });

    // Check if user purchased this product
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': queryId,
      orderStatus: { $ne: 'Cancelled' }
    });

    const isVerifiedBuyer = !!order;
    const hasReviewed = !!existingReview;
    const canReview = isVerifiedBuyer && !hasReviewed;

    res.status(200).json({
      success: true,
      data: {
        canReview,
        isVerifiedBuyer,
        hasReviewed,
        existingReview: existingReview || null,
        message: hasReviewed
          ? 'You have already submitted a review for this product.'
          : !isVerifiedBuyer
            ? 'Only verified buyers who purchased this product can submit a review.'
            : 'You are verified to write a customer review.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a product review (Verified buyers only)
// @route   POST /api/products/:productId/reviews or POST /api/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, title, comment, images } = req.body;
    const productId = req.params.productId || req.body.productId;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    let dbProduct = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      dbProduct = await Product.findById(productId);
    }
    if (!dbProduct) {
      dbProduct = await Product.findOne({ $or: [{ slug: productId }, { name: productId }] });
    }

    if (!dbProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check purchase history - ONLY VERIFIED BUYERS CAN REVIEW
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': dbProduct._id,
      orderStatus: { $ne: 'Cancelled' }
    });

    // Allow admins to review for catalog seeding/testing, but standard users must be verified buyers
    const isAdmin = req.user.role === 'admin';
    if (!order && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only verified buyers who have purchased this product can submit a review.'
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
        message: 'You have already submitted a review for this product.'
      });
    }

    // Format images array
    const reviewImages = Array.isArray(images) ? images.filter(img => typeof img === 'string' && img.trim().length > 0) : [];

    const review = new Review({
      user: req.user._id,
      userName: req.user.name || 'Valued Customer',
      userAvatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      userLocation: req.body.location || 'India',
      product: dbProduct._id,
      productName: dbProduct.name,
      rating: Number(rating),
      title: title || '',
      comment: comment || '',
      images: reviewImages,
      isVerifiedBuyer: true,
      isVerifiedPurchase: true,
      status: isAdmin ? 'approved' : 'pending' // Admin reviews auto-approved, customer reviews go to moderation queue
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: isAdmin
        ? 'Review published successfully!'
        : 'Thank you! Your review has been submitted for moderation and will appear once approved.',
      data: review
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews for Admin Moderation Queue
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAdminReviews = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate('user', 'name email avatar')
      .populate('product', 'name images price category slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get count breakdown for tabs
    const [pendingCount, approvedCount, rejectedCount, allCount] = await Promise.all([
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      Review.countDocuments({ status: 'rejected' }),
      Review.countDocuments({})
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        all: allCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review status (Approve or Reject review)
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
const updateReviewStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, or pending.'
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = status;
    if (rejectionReason !== undefined) {
      review.rejectionReason = rejectionReason;
    }

    await review.save();

    // Recalculate product rating upon approval/rejection
    await Review.calculateAverageRating(review.product);

    res.status(200).json({
      success: true,
      message: `Review marked as ${status} successfully`,
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
// @route   DELETE /api/reviews/:id or DELETE /api/admin/reviews/:id
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

// @desc    Get all customer reviews (Global showcase)
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .populate('product', 'name images price slug')
      .sort({ rating: -1, createdAt: -1 })
      .limit(30);

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
  checkEligibility,
  createProductReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview
};
