const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Banner = require('../models/Banner');
const HomeSection = require('../models/HomeSection');
const TrustBadge = require('../models/TrustBadge');

const seedPhase2 = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/velora_fashion';
    console.log('Connecting to MongoDB Atlas for Phase 2 Seeding...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully!');

    // 1. Seed Banners
    const bannersCount = await Banner.countDocuments();
    if (bannersCount === 0) {
      console.log('Seeding Hero Banners...');
      await Banner.insertMany([
        {
          title: 'ROYAL SURAT SILK SAREES',
          subtitle: 'Direct from master weavers in Surat. Pure Zari Banarasi & Kanjivaram masterpieces.',
          badge: 'FESTIVE EDIT 2026',
          desktopImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=80',
          mobileImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          ctaText: 'Shop Sarees',
          ctaLink: '/products?category=Sarees',
          order: 1,
          isActive: true,
          textColor: 'light',
          alignment: 'left'
        },
        {
          title: 'BRIDAL & CELEBRATION LEHENGAS',
          subtitle: 'Intricate handcrafted zardozi, sequins & velvet silhouettes for your special day.',
          badge: 'WEDDING COUTURE',
          desktopImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=80',
          mobileImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
          ctaText: 'Explore Lehengas',
          ctaLink: '/products?category=Lehengas',
          order: 2,
          isActive: true,
          textColor: 'light',
          alignment: 'left'
        },
        {
          title: 'READY-TO-WEAR SUITS & ANARKALIS',
          subtitle: 'Breezy georgettes, flared anarkalis & festive shararas with designer dupatta.',
          badge: 'NEW ARRIVALS',
          desktopImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1920&q=80',
          mobileImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
          ctaText: 'Discover Suits',
          ctaLink: '/products?category=Salwar%20Suits',
          order: 3,
          isActive: true,
          textColor: 'light',
          alignment: 'center'
        }
      ]);
      console.log('Hero Banners seeded successfully.');
    } else {
      console.log(`Hero Banners already exist (count: ${bannersCount}).`);
    }

    // 2. Seed Trust Badges
    const badgesCount = await TrustBadge.countDocuments();
    if (badgesCount === 0) {
      console.log('Seeding Trust Badges (USPs)...');
      await TrustBadge.insertMany([
        {
          title: 'Surat Direct Prices',
          subtitle: 'Wholesale factory rates with zero middlemen markups',
          icon: 'sparkles',
          order: 1,
          isActive: true
        },
        {
          title: 'Free Express Delivery',
          subtitle: 'On all prepaid orders across India above ₹999',
          icon: 'truck',
          order: 2,
          isActive: true
        },
        {
          title: 'Cash on Delivery',
          subtitle: 'Pay at your doorstep across 19,000+ pin codes',
          icon: 'creditCard',
          order: 3,
          isActive: true
        },
        {
          title: '7-Day Easy Returns',
          subtitle: 'Hassle-free doorstep exchange and refund policy',
          icon: 'rotate',
          order: 4,
          isActive: true
        },
        {
          title: '100% Quality Checked',
          subtitle: 'Every saree & lehenga hand-inspected before dispatch',
          icon: 'shield',
          order: 5,
          isActive: true
        }
      ]);
      console.log('Trust Badges seeded successfully.');
    } else {
      console.log(`Trust Badges already exist (count: ${badgesCount}).`);
    }

    // 3. Seed Home Sections
    const sectionsCount = await HomeSection.countDocuments();
    if (sectionsCount === 0) {
      console.log('Seeding Dynamic Home Sections...');
      await HomeSection.insertMany([
        {
          title: 'Shop by Ethnic Category',
          subtitle: 'Explore authentic creations crafted with traditional Surat mastery',
          type: 'story_circles',
          order: 1,
          isActive: true,
          config: {
            ctaText: 'All Categories',
            ctaLink: '/products'
          }
        },
        {
          title: 'Trending Wedding & Festive Hits',
          subtitle: 'Most coveted ethnic designs loved by thousands of brides & bridesmaids',
          type: 'product_grid',
          order: 2,
          isActive: true,
          config: {
            filterBy: 'trending',
            limit: 8,
            ctaText: 'View All Trending',
            ctaLink: '/products'
          }
        },
        {
          title: 'Surat Textile Special Highlights',
          subtitle: 'Handpicked spotlight collections straight from loom to your wardrobe',
          type: 'banner_grid',
          order: 3,
          isActive: true,
          config: {
            banners: [
              {
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                title: 'Pure Silk & Zari Heritage',
                subtitle: 'Banarasi, Kanjivaram & Paithani Weaves',
                link: '/products?category=Sarees',
                badge: 'BESTSELLER'
              },
              {
                image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
                title: 'Bridal & Reception Couture',
                subtitle: 'Velvet, Georgette & Floral Lehengas',
                link: '/products?category=Lehengas',
                badge: 'WEDDING'
              },
              {
                image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
                title: 'Festive Suits & Anarkalis',
                subtitle: 'Ready-to-wear with Matching Dupatta',
                link: '/products?category=Salwar%20Suits',
                badge: 'FAST DISPATCH'
              }
            ]
          }
        },
        {
          title: 'Celebration Steal Deals',
          subtitle: 'Special discounted festive picks with instant shipping guarantee',
          type: 'product_grid',
          order: 4,
          isActive: true,
          config: {
            filterBy: 'deal',
            limit: 8,
            ctaText: 'Shop All Deals',
            ctaLink: '/products?discount=50'
          }
        },
        {
          title: 'Custom Stitching & Bridal Video Consultation',
          subtitle: 'Connect directly with our Surat stylists on WhatsApp for video call blouse customization, size fitting & urgent dispatch.',
          type: 'campaign_banner',
          order: 5,
          isActive: true,
          config: {
            ctaText: 'Consult on WhatsApp',
            ctaLink: 'https://wa.me/919876543210',
            banners: [
              {
                image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
                title: 'Video Call Shopping Experience',
                subtitle: 'See fabric, zari shine & draping live from our Surat studio',
                link: 'https://wa.me/919876543210',
                badge: 'FREE SERVICE'
              }
            ]
          }
        }
      ]);
      console.log('Dynamic Home Sections seeded successfully.');
    } else {
      console.log(`Dynamic Home Sections already exist (count: ${sectionsCount}).`);
    }

    console.log('Phase 2 Database Seeding Finished Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Phase 2 data:', error);
    process.exit(1);
  }
};

seedPhase2();
