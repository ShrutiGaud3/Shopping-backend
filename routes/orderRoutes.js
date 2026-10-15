const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// POST /api/orders is open to both authenticated and guest users via optionalProtect
router.post('/', optionalProtect, createOrder);

// GET /api/orders & GET /api/orders/:id require authentication
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
