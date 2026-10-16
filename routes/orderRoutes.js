const express = require('express');
const router = express.Router();
const {
  createOrder,
  createPaymentIntent,
  verifyPayment,
  requestExchange,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// POST /api/orders is open to both authenticated and guest users via optionalProtect
router.post('/', optionalProtect, createOrder);

// Payment Intent & Verification
router.post('/payment-intent', optionalProtect, createPaymentIntent);
router.post('/verify-payment', optionalProtect, verifyPayment);

// Customer Exchange Request (10-day window check)
router.post('/:id/exchange', protect, requestExchange);

// GET /api/orders & GET /api/orders/:id require authentication
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;

