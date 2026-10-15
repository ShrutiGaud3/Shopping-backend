const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  getAllReviews,
  createProductReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

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
