const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getInventory,
  updateInventoryStock,
  getAllUsersAdmin,
  deleteUserAdmin
} = require('../controllers/adminController');
const {
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} = require('../controllers/orderController');
const {
  getCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication AND admin role
router.use(protect, adminOnly);

// Settings
router.put('/settings', updateSettings);

// Dashboard
router.get('/dashboard', getAdminDashboard);

// Inventory Management
router.get('/inventory', getInventory);
router.put('/inventory/:productId', updateInventoryStock);

// Order Pipeline Management
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatusAdmin);

// User Management
router.get('/users', getAllUsersAdmin);
router.delete('/users/:id', deleteUserAdmin);

// Coupon Management
router.route('/coupons')
  .get(getCoupons)
  .post(createCoupon);

router.delete('/coupons/:id', deleteCoupon);

module.exports = router;
