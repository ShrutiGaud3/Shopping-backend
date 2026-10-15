const express = require('express');
const router = express.Router();
const {
  getFaqs,
  getAllFaqsAdmin,
  createFaq,
  updateFaq,
  deleteFaq
} = require('../controllers/faqController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route
router.get('/', getFaqs);

// Admin routes
router.get('/all', protect, adminOnly, getAllFaqsAdmin);
router.post('/', protect, adminOnly, createFaq);
router.route('/:id')
  .put(protect, adminOnly, updateFaq)
  .delete(protect, adminOnly, deleteFaq);

module.exports = router;
