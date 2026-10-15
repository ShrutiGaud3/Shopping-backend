const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Setting = require('../models/Setting');
const Marquee = require('../models/Marquee');
const Category = require('../models/Category');
const Page = require('../models/Page');
const Faq = require('../models/Faq');

const seedPhase1Data = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://shrutigaud3_db_user:n19LR0L83Mp85Xbi@cluster0.f7jrpu4.mongodb.net/fashion_ecommerce?retryWrites=true&w=majority&appName=Cluster0';
    console.log('[Phase 1 Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('[Phase 1 Seed] Connected successfully.');

    // 1. Seed Site Settings
    console.log('[Phase 1 Seed] Seeding Site Settings...');
    await Setting.deleteMany();
    await Setting.create({
      announcements: [
        { text: 'Cash on Delivery Available Across India | Worldwide Express Shipping', link: '/products', isActive: true },
        { text: 'Use Code PREPAID10 For Instant 10% OFF on Online Payments', link: '/products', isActive: true },
        { text: 'Need Custom Sizing? Order Directly with Master Tailors on WhatsApp 💬', link: '/products', isActive: true }
      ],
      whatsappNumber: '919876543210',
      whatsappPrefilledMessage: 'Hello VELORA Support! 👋 I am browsing your online store and need assistance.',
      supportPhone: '+91 98765 43210',
      supportEmail: 'support@velora.com',
      supportAddress: 'Ring Road Surat Fashion Hub, Surat, Gujarat - 395002, India',
      workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM IST',
      socialLinks: {
        facebook: 'https://facebook.com/velorafashion',
        instagram: 'https://instagram.com/velorafashion',
        pinterest: 'https://pinterest.com/velorafashion',
        youtube: 'https://youtube.com/velorafashion'
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
    });

    // 2. Seed Promo Marquee
    console.log('[Phase 1 Seed] Seeding Promo Marquee items...');
    await Marquee.deleteMany();
    await Marquee.insertMany([
      { text: 'FREE SHIPPING ON ALL ORDERS ABOVE ₹999', link: '/products', icon: 'Truck', order: 1, isActive: true },
      { text: '10-DAYS EASY SIZE EXCHANGE GUARANTEE', link: '/pages/refund-policy', icon: 'RotateCcw', order: 2, isActive: true },
      { text: 'NEW ARRIVALS: FESTIVE & BRIDAL LEHENGA SETS LIVE', link: '/products?category=Lehengas', icon: 'Sparkles', order: 3, isActive: true },
      { text: '100% HANDCRAFTED SURAT TEXTILE ASSURED', link: '/pages/about-us', icon: 'ShieldCheck', order: 4, isActive: true },
      { text: 'GET INSTANT 10% OFF ON ALL PREPAID PAYMENTS (UPI / CARDS)', link: '/products', icon: 'Sparkles', order: 5, isActive: true }
    ]);

    // 3. Seed Nested Categories (Women's Ethnic Wear Hierarchy)
    console.log('[Phase 1 Seed] Seeding Category Hierarchy & Mega Menu...');
    // Root Categories
    const rootCategoriesData = [
      { name: 'Sarees', slug: 'sarees', gender: 'Women', type: 'category', order: 1, showInMenu: true, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', description: 'Handcrafted Silk, Georgette, Organza & Bandhani Sarees' },
      { name: 'Lehenga Sets', slug: 'lehengas', gender: 'Women', type: 'category', order: 2, showInMenu: true, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', description: 'Designer Bridal, Bridesmaid & Festive Lehengas' },
      { name: 'Salwar & Kurtis', slug: 'kurtis', gender: 'Women', type: 'category', order: 3, showInMenu: true, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', description: 'Anarkali Suits, Straight Kurtas & Palazzo Sets' },
      { name: 'Occasion Wear', slug: 'occasion-wear', gender: 'Women', type: 'occasion', order: 4, showInMenu: true, image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80', description: 'Curated Wedding, Sangeet & Reception Outfits' },
      { name: 'Navratri Festive', slug: 'navratri-collection', gender: 'Women', type: 'festival', order: 5, showInMenu: true, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80', description: 'Chaniya Cholis & Vibrant Gujarati Mirror Work' },
      { name: 'Ready To Ship', slug: 'ready-to-ship', gender: 'Women', type: 'collection', order: 6, showInMenu: true, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', description: 'Dispatched in 24 Hours with Express Delivery' }
    ];

    for (const rCat of rootCategoriesData) {
      let root = await Category.findOne({ slug: rCat.slug });
      if (!root) {
        root = await Category.create(rCat);
      } else {
        Object.assign(root, rCat);
        await root.save();
      }

      // Add subcategories under Sarees
      if (rCat.slug === 'sarees') {
        const sareeSubs = [
          { name: 'Banarasi Silk Sarees', slug: 'banarasi-silk-sarees', parent: root._id, order: 1, showInMenu: true, type: 'category' },
          { name: 'Organza & Floral Sarees', slug: 'organza-sarees', parent: root._id, order: 2, showInMenu: true, type: 'category' },
          { name: 'Bandhani & Patola Sarees', slug: 'bandhani-sarees', parent: root._id, order: 3, showInMenu: true, type: 'category' },
          { name: 'Georgette Ready-to-Wear', slug: 'georgette-sarees', parent: root._id, order: 4, showInMenu: true, type: 'category' }
        ];
        for (const sub of sareeSubs) {
          const subExists = await Category.findOne({ slug: sub.slug });
          if (!subExists) await Category.create(sub);
        }
      }

      // Add subcategories under Lehengas
      if (rCat.slug === 'lehengas') {
        const lehengaSubs = [
          { name: 'Bridal Heritage Lehengas', slug: 'bridal-lehengas', parent: root._id, order: 1, showInMenu: true, type: 'category' },
          { name: 'Sangeet & Cocktail Lehengas', slug: 'sangeet-lehengas', parent: root._id, order: 2, showInMenu: true, type: 'category' },
          { name: 'Velvet Winter Lehengas', slug: 'velvet-lehengas', parent: root._id, order: 3, showInMenu: true, type: 'category' }
        ];
        for (const sub of lehengaSubs) {
          const subExists = await Category.findOne({ slug: sub.slug });
          if (!subExists) await Category.create(sub);
        }
      }
    }

    // 4. Seed FAQs
    console.log('[Phase 1 Seed] Seeding FAQs...');
    await Faq.deleteMany();
    await Faq.insertMany([
      {
        question: 'How do I place an order for custom stitched blouses or lehengas?',
        answer: 'You can order directly online selecting standard sizing, or click the "Order on WhatsApp" button on any product page to send your custom measurements directly to our master tailors in Surat.',
        category: 'Sizing & Customization',
        order: 1,
        isActive: true
      },
      {
        question: 'How long does domestic shipping take across India?',
        answer: 'Orders are dispatched within 24 to 48 hours. Metro cities receive delivery in 3 to 4 business days; rest of India takes 4 to 6 business days.',
        category: 'Shipping & Delivery',
        order: 2,
        isActive: true
      },
      {
        question: 'What is your 10-Day Exchange policy?',
        answer: 'We provide an easy 10-day exchange window for all unworn, unwashed items with original tags intact. Simply visit "My Orders" and click "Request Exchange".',
        category: 'Returns & Exchange',
        order: 3,
        isActive: true
      },
      {
        question: 'Is Cash on Delivery (COD) available?',
        answer: 'Yes! Cash on Delivery is available across all serviceable pincodes in India for orders up to ₹10,000.',
        category: 'Orders & Payment',
        order: 4,
        isActive: true
      },
      {
        question: 'Do you offer worldwide international shipping?',
        answer: 'Yes, we ship to over 120 countries worldwide including the USA, UK, Canada, Australia, and UAE via DHL Express.',
        category: 'Shipping & Delivery',
        order: 5,
        isActive: true
      }
    ]);

    console.log('[Phase 1 Seed] Phase 1 database seeding completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('[Phase 1 Seed Error]:', error);
    process.exit(1);
  }
};

seedPhase1Data();
