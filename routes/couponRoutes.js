const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Validate coupon for checkout (Public or Auth)
router.post('/validate', validateCoupon);

// Get all coupons, create coupon, delete coupon
router.route('/')
  .get(getCoupons)
  .post(protect, adminOnly, createCoupon);

router.route('/:id')
  .delete(protect, adminOnly, deleteCoupon);

module.exports = router;
