const express = require('express');
const router = express.Router();
const {
  getPublishedBlogs,
  getBlogBySlug,
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public endpoints
router.get('/', getPublishedBlogs);

// Admin endpoints (MUST come before /:slug so "admin" isn't matched as a slug)
router.get('/admin/all', protect, adminOnly, getAdminBlogs);
router.get('/admin/:id', protect, adminOnly, getAdminBlogById);
router.post('/admin', protect, adminOnly, createBlog);
router.put('/admin/:id', protect, adminOnly, updateBlog);
router.delete('/admin/:id', protect, adminOnly, deleteBlog);

// Also accept standard REST CRUD with auth
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

// Public single post by slug
router.get('/:slug', getBlogBySlug);

module.exports = router;
