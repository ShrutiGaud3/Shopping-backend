const express = require('express');
const router = express.Router();
const {
  subscribeNewsletter,
  getAdminSubscribers,
  exportSubscribersCSV,
  deleteSubscriber
} = require('../controllers/subscriberController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route to subscribe
router.post('/', subscribeNewsletter);

// Admin routes
router.get('/subscribers', protect, adminOnly, getAdminSubscribers);
router.get('/subscribers/export', protect, adminOnly, exportSubscribersCSV);
router.delete('/subscribers/:id', protect, adminOnly, deleteSubscriber);

module.exports = router;
