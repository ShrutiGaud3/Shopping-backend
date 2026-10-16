const express = require('express');
const router = express.Router();
const {
  getShippingZones,
  getAllShippingZonesAdmin,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone
} = require('../controllers/shippingZoneController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route for storefront checkout
router.get('/', getShippingZones);

// Admin routes
router.get('/admin', protect, adminOnly, getAllShippingZonesAdmin);
router.post('/', protect, adminOnly, createShippingZone);
router.route('/:id')
  .put(protect, adminOnly, updateShippingZone)
  .delete(protect, adminOnly, deleteShippingZone);

module.exports = router;
