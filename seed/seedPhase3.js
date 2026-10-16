const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

const ethnicProducts = [
  {
    name: 'Royal Ruby Red Pure Banarasi Katan Silk Saree with Zari Weave',
    slug: 'royal-ruby-red-pure-banarasi-katan-silk-saree',
    category: 'Sarees',
    brand: 'Surati Weaves',
    gender: 'Women',
    price: 2499,
    originalPrice: 6999,
    discountPercent: 64,
    description: 'Directly sourced from heritage Surat handlooms, this authentic Ruby Red Banarasi Katan Silk saree features elaborate floral jaal woven in shimmering antique gold zari. Comes complete with a running blouse piece.',
    stock: 20,
    sku: 'SK-SAR-BAN-101',
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    isTrending: true,
    isDeal: false,
    isNewArrival: false,
    fabric: 'Pure Katan Silk',
    work: 'Golden Zari Weaving',
    occasion: 'Bridal & Wedding',
    washCare: 'Dry Clean Only',
    setContents: '1 Saree (5.5m) with 0.8m Unstitched Blouse Piece',
    sareeLength: '5.5 Meters + 0.8 Meter Blouse',
    dispatchTime: 'Ready to Dispatch in 24 Hours',
    videoUrl: '',
    stitchOptions: [
      {
        type: 'Unstitched (Free)',
        price: 0,
        description: 'Saree with unstitched blouse material'
      },
      {
        type: 'Ready to Wear + Fall Pico (+₹299)',
        price: 299,
        description: 'Fall, Pico & Pre-pleated drape done'
      },
      {
        type: 'Custom Stitched Designer Blouse (+₹699)',
        price: 699,
        description: 'Custom measurements taken via WhatsApp video call'
      }
    ],
    deliveryInfo: {
      estimatedDays: 3,
      isCodAvailable: true,
      freeShipping: true
    },
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['Free Size', 'Custom Tailored'],
    colors: [
      { name: 'Ruby Red', hex: '#9B111E' },
      { name: 'Royal Gold', hex: '#D4AF37' }
    ]
  },
  {
    name: 'Crimson Red Handcrafted Velvet Bridal Lehenga Choli Set',
    slug: 'crimson-red-handcrafted-velvet-bridal-lehenga-choli-set',
    category: 'Lehengas',
    brand: 'Surati Couture',
    gender: 'Women',
    price: 6999,
    originalPrice: 18999,
    discountPercent: 63,
    description: 'A regal bridal masterpiece crafted on micro velvet fabric with intricate dori, sequins, and antique zardozi work. Features double can-can inner lining with an opulent 4.2 meter flare for a magnificent bridal walk.',
    stock: 15,
    sku: 'SK-LEH-VEL-202',
    rating: 5.0,
    reviewsCount: 24,
    isFeatured: true,
    isTrending: true,
    isDeal: true,
    isNewArrival: false,
    fabric: 'Micro Velvet',
    work: 'Zardozi & Heavy Sequins Handwork',
    occasion: 'Bridal & Wedding',
    washCare: 'Dry Clean Only',
    setContents: '1 Semi-Stitched Lehenga, 1 Unstitched Choli, 1 Bridal Net Dupatta',
    lehengaFlare: '4.2 Meters Flared Gher with Double Canvas & Can-can',
    dispatchTime: 'Ready to Dispatch in 48 Hours',
    videoUrl: '',
    stitchOptions: [
      {
        type: 'Semi-Stitched (Free)',
        price: 0,
        description: 'Lehenga waist up to 44 inches with open side seam'
      },
      {
        type: 'Full Custom Tailored Set (+₹999)',
        price: 999,
        description: 'Custom blouse & lehenga fitting done by master Surat tailors'
      }
    ],
    deliveryInfo: {
      estimatedDays: 4,
      isCodAvailable: true,
      freeShipping: true
    },
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['Semi-Stitched', 'Custom Stitching'],
    colors: [
      { name: 'Crimson Red', hex: '#8B0000' },
      { name: 'Maroon Gold', hex: '#800000' }
    ]
  },
  {
    name: 'Emerald Green Embroidered Georgette Anarkali Suit Set',
    slug: 'emerald-green-embroidered-georgette-anarkali-suit-set',
    category: 'Salwar Suits',
    brand: 'Surati Weaves',
    gender: 'Women',
    price: 1899,
    originalPrice: 4599,
    discountPercent: 58,
    description: 'Make a graceful statement with this floor-touch emerald green georgette Anarkali suit. Adorned with delicate thread embroidery, faux mirror highlights, and accompanied by a featherlight nazmin dupatta with lace border.',
    stock: 25,
    sku: 'SK-SUT-ANA-303',
    rating: 4.8,
    reviewsCount: 19,
    isFeatured: false,
    isTrending: true,
    isDeal: false,
    isNewArrival: true,
    fabric: 'Pure Fox Georgette',
    work: 'Thread Embroidery & Mirror Work',
    occasion: 'Festive & Sangeet',
    washCare: 'Dry Clean or Gentle Hand Wash',
    setContents: '1 Fully Stitched Anarkali Top, 1 Micro Santoon Bottom, 1 Nazmin Dupatta',
    dispatchTime: 'Ready to Dispatch in 24 Hours',
    videoUrl: '',
    stitchOptions: [
      {
        type: 'Fully Stitched Ready-to-Wear (Free)',
        price: 0,
        description: 'Ready to wear as per selected size'
      },
      {
        type: 'Custom Sizing Adjustment (+₹199)',
        price: 199,
        description: 'Minor margin and length adjustments'
      }
    ],
    deliveryInfo: {
      estimatedDays: 3,
      isCodAvailable: true,
      freeShipping: true
    },
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Emerald Green', hex: '#50C878' },
      { name: 'Deep Teal', hex: '#008080' }
    ]
  },
  {
    name: 'Mustard Gold Temple Border Kanjivaram Soft Silk Saree',
    slug: 'mustard-gold-temple-border-kanjivaram-soft-silk-saree',
    category: 'Sarees',
    brand: 'Surati Weaves',
    gender: 'Women',
    price: 2199,
    originalPrice: 5499,
    discountPercent: 60,
    description: 'A traditional masterpiece featuring contrast maroon pallu and temple korvai borders woven in pure golden zari. Soft to touch, rich in appearance, and perfect for morning wedding rituals and pujas.',
    stock: 18,
    sku: 'SK-SAR-KAN-104',
    rating: 4.9,
    reviewsCount: 31,
    isFeatured: true,
    isTrending: false,
    isDeal: false,
    isNewArrival: true,
    fabric: 'Kanjivaram Silk',
    work: 'Temple Motif Zari Border',
    occasion: 'Festive & Puja',
    washCare: 'Dry Clean Only',
    setContents: '1 Saree (5.5m) with 0.8m Blouse Piece',
    sareeLength: '5.5 Meters + 0.8m Blouse',
    dispatchTime: 'Ready to Dispatch in 24 Hours',
    videoUrl: '',
    stitchOptions: [
      {
        type: 'Unstitched (Free)',
        price: 0,
        description: 'Saree with unstitched blouse material'
      },
      {
        type: 'Ready to Wear + Fall Pico (+₹299)',
        price: 299,
        description: 'Fall, Pico & Pre-pleated drape done'
      }
    ],
    deliveryInfo: {
      estimatedDays: 3,
      isCodAvailable: true,
      freeShipping: true
    },
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Mustard Gold', hex: '#FFDB58' },
      { name: 'Maroon', hex: '#800000' }
    ]
  },
  {
    name: 'Pastel Pink Floral Printed Pure Organza Saree with Scallop Border',
    slug: 'pastel-pink-floral-printed-pure-organza-saree',
    category: 'Sarees',
    brand: 'Surati Couture',
    gender: 'Women',
    price: 1499,
    originalPrice: 3999,
    discountPercent: 62,
    description: 'Chic, breezy, and effortlessly modern. Made with crisp pure organza silk fabric featuring romantic English rose floral prints and hand-cut embroidered scalloped borders. An Instagram influencer favorite!',
    stock: 30,
    sku: 'SK-SAR-ORG-105',
    rating: 4.8,
    reviewsCount: 42,
    isFeatured: false,
    isTrending: true,
    isDeal: true,
    isNewArrival: false,
    fabric: 'Pure Organza',
    work: 'Digital Floral Print & Cutwork Border',
    occasion: 'Party Wear & Festive',
    washCare: 'Dry Clean Only',
    setContents: '1 Saree (5.5m) with Banglori Silk Blouse Piece',
    sareeLength: '5.5 Meters + 0.8m Blouse',
    dispatchTime: 'Ready to Dispatch in 24 Hours',
    videoUrl: '',
    stitchOptions: [
      {
        type: 'Unstitched (Free)',
        price: 0,
        description: 'Saree with unstitched blouse material'
      },
      {
        type: 'Designer Blouse Tailored (+₹599)',
        price: 599,
        description: 'Stitched blouse with lining & cups'
      }
    ],
    deliveryInfo: {
      estimatedDays: 3,
      isCodAvailable: true,
      freeShipping: true
    },
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Pastel Pink', hex: '#FFD1DC' },
      { name: 'Powder Blue', hex: '#B0E0E6' }
    ]
  },
  {
    name: 'Chanderi Silk Straight Kurti Pant Set with Organza Dupatta',
    slug: 'chanderi-silk-straight-kurti-pant-set',
    category: 'Kurtis',
    brand: 'Surati Studio',
    gender: 'Women',
    price: 1299,
    originalPrice: 2999,
    discountPercent: 56,
    description: 'Classic 3-piece ethnic kurta set made from Chanderi silk with delicate gota patti and zari detailing on the neckline. Paired with comfortable matching straight pants and a coordinating digital printed organza dupatta.',
    stock: 40,
    sku: 'SK-KUR-CHA-401',
    rating: 4.7,
    reviewsCount: 16,
    isFeatured: false,
    isTrending: false,
    isDeal: true,
    isNewArrival: true,
    fabric: 'Chanderi Silk',
    work: 'Zari Yoke & Gotta Patti Lace',
    occasion: 'Festive & Casual',
    washCare: 'Gentle Hand Wash',
    setContents: '1 Stitched Kurti, 1 Pant, 1 Organza Dupatta',
    dispatchTime: 'Ready to Dispatch in 24 Hours',
    videoUrl: '',
    stitchOptions: [
      {
        type: 'Ready to Wear 3-Piece Set (Free)',
        price: 0,
        description: 'Ready to wear as per size'
      }
    ],
    deliveryInfo: {
      estimatedDays: 3,
      isCodAvailable: true,
      freeShipping: true
    },
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Peacock Blue', hex: '#33A1C9' },
      { name: 'Coral Peach', hex: '#F88379' }
    ]
  },
  {
    name: 'Wine Purple Georgette Embroidered Flared Evening Gown',
    slug: 'wine-purple-georgette-embroidered-flared-evening-gown',
    category: 'Gowns',
    brand: 'Surati Couture',
    gender: 'Women',
    price: 2799,
    originalPrice: 6999,
    discountPercent: 60,
    description: 'Channel contemporary royalty in this wine purple indo-western gown crafted with premium heavy fox georgette. Highlighted with sequins and tonal thread cording embroidery for sangeet and cocktail receptions.',
    stock: 12,
    sku: 'SK-GWN-IND-501',
    rating: 4.9,
    reviewsCount: 22,
    isFeatured: true,
    isTrending: true,
    isDeal: false,
    isNewArrival: false,
    fabric: 'Georgette & Net',
    work: 'Sequins & Cording Embroidery',
    occasion: 'Reception & Sangeet',
    washCare: 'Dry Clean Only',
    setContents: '1 Full Length Stitched Gown with Inner Crepe Lining',
    dispatchTime: 'Ready to Dispatch in 24 Hours',
    videoUrl: '',
    stitchOptions: [
      {
        type: 'Stitched Gown with Margins (Free)',
        price: 0,
        description: '4 inch margin inside for easy alterations'
      }
    ],
    deliveryInfo: {
      estimatedDays: 4,
      isCodAvailable: true,
      freeShipping: true
    },
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Wine Purple', hex: '#722F37' },
      { name: 'Navy Blue', hex: '#000080' }
    ]
  }
];

const seedPhase3 = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/velora_fashion';
    console.log('Connecting to MongoDB Atlas for Phase 3 Seeding...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB!');

    // Check if ethnic products already exist
    for (const item of ethnicProducts) {
      const existing = await Product.findOne({ sku: item.sku });
      if (!existing) {
        await Product.create(item);
        console.log(`Seeded: ${item.name}`);
      } else {
        await Product.updateOne({ sku: item.sku }, item);
        console.log(`Updated: ${item.name}`);
      }
    }

    const totalProducts = await Product.countDocuments();
    console.log(`Total Products in Database: ${totalProducts}`);
    console.log('Phase 3 Product Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Phase 3 products:', err);
    process.exit(1);
  }
};

seedPhase3();
