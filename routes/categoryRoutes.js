const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route for nested category tree
router.get('/tree', getCategoryTree);

// Base category routes
router.route('/')
  .get(getCategories)
  .post(protect, adminOnly, createCategory);

// ID-specific routes
router.route('/:id')
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;
