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
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders requires authenticated customer account
router.post('/', protect, createOrder);

// Payment Intent & Verification require authenticated customer
router.post('/payment-intent', protect, createPaymentIntent);
router.post('/verify-payment', protect, verifyPayment);

// Customer Exchange Request (10-day window check)
router.post('/:id/exchange', protect, requestExchange);

// GET /api/orders & GET /api/orders/:id require authentication
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;

