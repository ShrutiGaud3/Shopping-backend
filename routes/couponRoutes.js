const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Validate and apply coupon for checkout (Populates req.user if Bearer token present)
router.post('/validate', optionalProtect, validateCoupon);
router.post('/apply', optionalProtect, validateCoupon);

// Get all coupons, create coupon
router.route('/')
  .get(getCoupons)
  .post(protect, adminOnly, createCoupon);

router.route('/:id')
  .put(protect, adminOnly, updateCoupon)
  .delete(protect, adminOnly, deleteCoupon);

module.exports = router;

