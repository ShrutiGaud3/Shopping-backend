const Setting = require('../models/Setting');

// Default Fallback Settings
const defaultSettings = {
  announcements: [
    { text: 'Cash on Delivery Available Across India | Worldwide Express Shipping', link: '/products', isActive: true },
    { text: 'Use Code PREPAID10 For Instant 10% OFF on Online Payments', link: '/products', isActive: true },
    { text: 'Need Styling Advice? Order Directly on WhatsApp 💬', link: '/products', isActive: true }
  ],
  whatsappNumber: '919876543210',
  whatsappPrefilledMessage: 'Hello VELORA Support! 👋 I am browsing your online store and need assistance.',
  supportPhone: '+91 98765 43210',
  supportEmail: 'support@velora.com',
  supportAddress: 'Ring Road Surat Fashion Hub, Surat, Gujarat - 395002, India',
  workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM IST',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
    youtube: 'https://youtube.com'
  },
  codEnabled: true,
  codExtraCharge: 50,
  freeShippingThreshold: 999,
  standardShippingFee: 99,
  footerAboutText: 'VELORA is India’s premier destination for luxury women’s ethnic couture, handcrafted sarees, designer lehengas, and contemporary festive wear.',
  copyrightText: '© 2026 VELORA Fashion Hub. All Rights Reserved.',
  seoDefaults: {
    metaTitle: 'VELORA | Luxury Women\'s Ethnic Wear & Festive Couture',
    metaDescription: 'Shop authentic handcrafted sarees, designer bridal lehengas, festive anarkalis, and kurtis online with worldwide shipping and COD.',
    ogImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
  }
};

// @desc    Get store settings (Public)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Auto seed default settings document if none exists
      settings = await Setting.create(defaultSettings);
    }
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: defaultSettings
    });
  }
};

// @desc    Update store settings
// @route   PUT /api/settings/admin OR PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const saved = await settings.save();
    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      data: saved
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
