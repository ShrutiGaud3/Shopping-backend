const express = require('express');
const router = express.Router();
const {
  getPages,
  getAllPagesAdmin,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage
} = require('../controllers/pageController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getPages);
router.get('/all', protect, adminOnly, getAllPagesAdmin);
router.get('/:slug', getPageBySlug);

// Admin routes
router.post('/', protect, adminOnly, createPage);
router.route('/:id')
  .put(protect, adminOnly, updatePage)
  .delete(protect, adminOnly, deletePage);

module.exports = router;
