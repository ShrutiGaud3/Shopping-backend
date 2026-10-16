const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getInventory,
  updateInventoryStock,
  getAllUsersAdmin,
  updateUserRoleAdmin,
  deleteUserAdmin
} = require('../controllers/adminController');
const {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  updateExchangeStatusAdmin
} = require('../controllers/orderController');
const {
  getCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const {
  getAdminReviews,
  updateReviewStatus,
  deleteReview
} = require('../controllers/reviewController');
const {
  getAdminSubscribers,
  exportSubscribersCSV,
  deleteSubscriber
} = require('../controllers/subscriberController');
const { updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, superAdminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication AND administrative privileges
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getAdminDashboard);

// Settings (Super Admin / Admin)
router.put('/settings', superAdminOnly, updateSettings);

// Inventory Management
router.get('/inventory', getInventory);
router.put('/inventory/:productId', updateInventoryStock);

// Order Pipeline Management
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatusAdmin);
router.put('/orders/:id/exchange', updateExchangeStatusAdmin);

// User & Role Management
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/role', superAdminOnly, updateUserRoleAdmin);
router.delete('/users/:id', superAdminOnly, deleteUserAdmin);

// Coupon Management
router.route('/coupons')
  .get(getCoupons)
  .post(superAdminOnly, createCoupon);

router.delete('/coupons/:id', superAdminOnly, deleteCoupon);

// Review Moderation Queue
router.get('/reviews', getAdminReviews);
router.put('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

// Newsletter Subscribers Management
router.get('/subscribers', getAdminSubscribers);
router.get('/subscribers/export', exportSubscribersCSV);
router.delete('/subscribers/:id', deleteSubscriber);

module.exports = router;
