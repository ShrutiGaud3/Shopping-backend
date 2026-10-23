const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Announcement Bar Texts
  announcements: [{
    text: { type: String, required: true },
    link: { type: String, default: '/products' },
    isActive: { type: Boolean, default: true }
  }],
  // Contact & WhatsApp
  whatsappNumber: {
    type: String,
    default: '919876543210',
    trim: true
  },
  whatsappPrefilledMessage: {
    type: String,
    default: 'Hello VELORA Support! 👋 I am browsing your online store and need assistance.'
  },
  supportPhone: {
    type: String,
    default: '+91 98765 43210',
    trim: true
  },
  supportEmail: {
    type: String,
    default: 'support@velora.com',
    trim: true
  },
  supportAddress: {
    type: String,
    default: 'Weavera Fashion Studio, India'
  },
  workingHours: {
    type: String,
    default: 'Mon - Sat: 10:00 AM - 7:00 PM IST'
  },
  // Social Links
  socialLinks: {
    facebook: { type: String, default: 'https://facebook.com' },
    instagram: { type: String, default: 'https://instagram.com' },
    pinterest: { type: String, default: 'https://pinterest.com' },
    youtube: { type: String, default: 'https://youtube.com' }
  },
  // Payment & Shipping Policies
  codEnabled: {
    type: Boolean,
    default: true
  },
  codExtraCharge: {
    type: Number,
    default: 50,
    min: 0
  },
  freeShippingThreshold: {
    type: Number,
    default: 999,
    min: 0
  },
  standardShippingFee: {
    type: Number,
    default: 99,
    min: 0
  },
  // Footer & Branding
  footerAboutText: {
    type: String,
    default: 'VELORA is India’s premier destination for luxury women’s ethnic couture, handcrafted sarees, designer lehengas, and contemporary festive wear.'
  },
  copyrightText: {
    type: String,
    default: '© 2026 VELORA Fashion Hub. All Rights Reserved.'
  },
  // SEO Defaults
  seoDefaults: {
    metaTitle: { type: String, default: 'VELORA | Luxury Women\'s Ethnic Wear & Festive Couture' },
    metaDescription: { type: String, default: 'Shop authentic handcrafted sarees, designer bridal lehengas, festive anarkalis, and kurtis online with worldwide shipping and COD.' },
    ogImage: { type: String, default: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
