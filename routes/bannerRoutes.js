const express = require('express');
const router = express.Router();
const {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route for storefront
router.get('/', getBanners);

// Admin routes
router.get('/admin', protect, adminOnly, getAllBannersAdmin);
router.post('/', protect, adminOnly, createBanner);
router.put('/:id', protect, adminOnly, updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
