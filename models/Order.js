const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customerName: {
    type: String,
    required: true,
    default: 'Customer'
  },
  customerEmail: {
    type: String,
    required: true,
    default: 'customer@example.com'
  },
  customerPhone: {
    type: String,
    default: ''
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, default: '' },
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI', 'Card'],
    required: true,
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  shippingCharge: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  couponCode: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
