const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getAllContactMessages,
  updateContactStatus
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// POST /api/contact - Public submission
router.post('/', submitContactMessage);

// GET /api/contact - Admin only
router.get('/', protect, adminOnly, getAllContactMessages);

// PUT /api/contact/:id - Admin update status
router.put('/:id', protect, adminOnly, updateContactStatus);

module.exports = router;
