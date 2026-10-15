const express = require('express');
const router = express.Router();
const {
  getHomeSections,
  getAllHomeSectionsAdmin,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection
} = require('../controllers/homeSectionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route for storefront
router.get('/', getHomeSections);

// Admin routes
router.get('/admin', protect, adminOnly, getAllHomeSectionsAdmin);
router.post('/', protect, adminOnly, createHomeSection);
router.put('/:id', protect, adminOnly, updateHomeSection);
router.delete('/:id', protect, adminOnly, deleteHomeSection);

module.exports = router;
