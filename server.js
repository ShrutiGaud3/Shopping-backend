const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingRoutes = require('./routes/settingRoutes');
const marqueeRoutes = require('./routes/marqueeRoutes');
const pageRoutes = require('./routes/pageRoutes');
const faqRoutes = require('./routes/faqRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const homeSectionRoutes = require('./routes/homeSectionRoutes');
const trustBadgeRoutes = require('./routes/trustBadgeRoutes');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Core Middlewares
// Enable CORS for all incoming client origins (localhost, Vercel, Netlify, Render, etc.)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base API Healthcheck Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VELORA Fashion E-Commerce REST API Engine is Running',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Mount API Route Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/marquee', marqueeRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/home-sections', homeSectionRoutes);
app.use('/api/trust-badges', trustBadgeRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[VELORA Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
