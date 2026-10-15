const express = require('express');
const router = express.Router();
const {
  getMarquees,
  getAllMarqueesAdmin,
  createMarquee,
  updateMarquee,
  deleteMarquee
} = require('../controllers/marqueeController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route to fetch active marquees
router.get('/', getMarquees);

// Admin routes
router.get('/all', protect, adminOnly, getAllMarqueesAdmin);
router.post('/', protect, adminOnly, createMarquee);
router.route('/:id')
  .put(protect, adminOnly, updateMarquee)
  .delete(protect, adminOnly, deleteMarquee);

module.exports = router;
