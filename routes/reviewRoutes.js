const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  getAllReviews,
  checkEligibility,
  createProductReview,
  deleteReview,
  getAdminReviews,
  updateReviewStatus
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Check user review eligibility (verified buyer check)
router.get('/check-eligibility/:productId', protect, checkEligibility);

// Direct product reviews endpoint
router.get('/product/:productId', getProductReviews);

// Admin review moderation routes
router.get('/admin', protect, adminOnly, getAdminReviews);
router.put('/admin/:id/status', protect, adminOnly, updateReviewStatus);

router.route('/')
  .get((req, res, next) => {
    if (req.params.productId) {
      return getProductReviews(req, res, next);
    }
    return getAllReviews(req, res, next);
  })
  .post(protect, createProductReview);

router.route('/:id')
  .delete(protect, deleteReview);

module.exports = router;
