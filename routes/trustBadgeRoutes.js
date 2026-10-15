const express = require('express');
const router = express.Router();
const {
  getTrustBadges,
  getAllTrustBadgesAdmin,
  createTrustBadge,
  updateTrustBadge,
  deleteTrustBadge
} = require('../controllers/trustBadgeController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route for storefront
router.get('/', getTrustBadges);

// Admin routes
router.get('/admin', protect, adminOnly, getAllTrustBadgesAdmin);
router.post('/', protect, adminOnly, createTrustBadge);
router.put('/:id', protect, adminOnly, updateTrustBadge);
router.delete('/:id', protect, adminOnly, deleteTrustBadge);

module.exports = router;
