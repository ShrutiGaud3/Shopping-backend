const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Category = require('../models/Category');

const realisticProducts = [
  // ===================== 1. SAREES =====================
  {
    name: 'Royal Banarasi Silk Zari Saree',
    brand: 'Velora Heritage',
    category: 'Sarees',
    gender: 'Women',
    price: 3499,
    originalPrice: 6999,
    discountPercent: 50,
    description: 'Authentic Banarasi pure katan silk saree featuring intricate gold zari floral jaal, opulent pallu, and unstitched matching blouse piece. Handcrafted by master weavers in Varanasi.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Crimson Red', hex: '#991B1B' },
      { name: 'Royal Gold', hex: '#D97706' }
    ],
    stock: 25,
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    isTrending: true,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      fabric: 'Pure Katan Silk',
      care: 'Dry Clean Only',
      occasion: 'Wedding / Festive',
      pattern: 'Zari Brocade Floral Weave'
    }
  },
  {
    name: 'Blush Pink Embroidered Organza Saree',
    brand: 'Velora Atelier',
    category: 'Sarees',
    gender: 'Women',
    price: 2899,
    originalPrice: 4999,
    discountPercent: 42,
    description: 'Ethereal translucent pastel organza silk saree highlighted with handcrafted thread embroidery, scalloped zari borders, and a lustrous raw silk blouse piece.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Blush Pink', hex: '#F472B6' },
      { name: 'Mint Green', hex: '#6EE7B7' }
    ],
    stock: 18,
    rating: 4.8,
    reviewsCount: 22,
    isFeatured: true,
    isTrending: true,
    isDeal: false,
    isNewArrival: true,
    specifications: {
      fabric: 'Premium Pure Organza',
      care: 'Dry Clean Only',
      occasion: 'Party / Day Wedding',
      pattern: 'Scalloped Floral Resham'
    }
  },
  {
    name: 'Traditional Bandhani Georgette Saree',
    brand: 'Velora Heritage',
    category: 'Sarees',
    gender: 'Women',
    price: 2499,
    originalPrice: 4499,
    discountPercent: 44,
    description: 'Timeless Gujarati tie-and-dye Bandhani crafted on fluid pure georgette with gota patti handwork across the border and pallu. Lightweight, graceful, and festive.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Maroon', hex: '#7F1D1D' },
      { name: 'Mustard Yellow', hex: '#EAB308' }
    ],
    stock: 20,
    rating: 4.7,
    reviewsCount: 19,
    isFeatured: false,
    isTrending: true,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      fabric: 'Pure Viscose Georgette',
      care: 'Dry Clean Only',
      occasion: 'Puja / Festive',
      pattern: 'Handcrafted Bandhani Dot Knot'
    }
  },
  {
    name: 'Pre-Draped Ready-to-Wear Georgette Saree',
    brand: 'Velora Studio',
    category: 'Sarees',
    gender: 'Women',
    price: 2199,
    originalPrice: 3999,
    discountPercent: 45,
    description: 'Effortless glam in 60 seconds! Ready-to-wear pre-stitched pleated saree with belt detail and embellished sleeveless designer blouse piece.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Wine Red', hex: '#881337' },
      { name: 'Black', hex: '#111827' }
    ],
    stock: 30,
    rating: 4.6,
    reviewsCount: 14,
    isFeatured: true,
    isTrending: false,
    isDeal: true,
    isNewArrival: true,
    specifications: {
      fabric: 'Poly Georgette',
      care: 'Dry Clean / Hand Wash Gently',
      occasion: 'Cocktail / Reception',
      pattern: 'Solid Pleated Drape'
    }
  },

  // ===================== 2. LEHENGA SETS =====================
  {
    name: 'Royal Crimson Velvet Bridal Heritage Lehenga',
    brand: 'Haute Velora',
    category: 'Lehenga Sets',
    gender: 'Women',
    price: 8999,
    originalPrice: 17999,
    discountPercent: 50,
    description: 'Exquisite bridal couture masterpiece crafted on heavy micro velvet. Embellished with authentic zardozi, hand-cut sequins, dabka wirework, and paired with double net dupattas.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Semi-Stitched', 'M', 'L'],
    colors: [
      { name: 'Deep Crimson', hex: '#881337' },
      { name: 'Royal Ruby', hex: '#991B1B' }
    ],
    stock: 12,
    rating: 5.0,
    reviewsCount: 45,
    isFeatured: true,
    isTrending: true,
    isDeal: false,
    isNewArrival: true,
    specifications: {
      fabric: 'Heavy Micro Velvet 9000',
      care: 'Professional Bridal Dry Clean Only',
      occasion: 'Bridal / Wedding',
      pattern: 'Intricate Zardozi & Floral Kalis'
    }
  },
  {
    name: 'Emerald Green Sequin Flared Sangeet Lehenga',
    brand: 'Haute Velora',
    category: 'Lehenga Sets',
    gender: 'Women',
    price: 5499,
    originalPrice: 9999,
    discountPercent: 45,
    description: 'Showstopper sangeet ensemble in deep emerald green georgette with 12-meter flare, all-over dual-tone mirror sequin work, backless sweetheart neck choli, and ruffled dupatta.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Semi-Stitched', 'S', 'M', 'L'],
    colors: [
      { name: 'Emerald Green', hex: '#065F46' },
      { name: 'Teal Blue', hex: '#0F766E' }
    ],
    stock: 15,
    rating: 4.9,
    reviewsCount: 29,
    isFeatured: true,
    isTrending: true,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      fabric: 'Heavy Blooming Georgette',
      care: 'Dry Clean Only',
      occasion: 'Sangeet / Reception / Cocktail',
      pattern: 'Geometric Sequin Sparkle'
    }
  },
  {
    name: 'Pastel Blush Pink Floral Silk Bridesmaid Lehenga',
    brand: 'Velora Studio',
    category: 'Lehenga Sets',
    gender: 'Women',
    price: 4499,
    originalPrice: 7999,
    discountPercent: 44,
    description: 'Chic daylight festive lehenga in raw mulberry silk with pastel botanical resham threadwork, pearl bead latkans, and a gossamer organza embroidered dupatta.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Semi-Stitched', 'M', 'L'],
    colors: [
      { name: 'Blush Pink', hex: '#F9A8D4' },
      { name: 'Peach', hex: '#FDBA74' }
    ],
    stock: 14,
    rating: 4.8,
    reviewsCount: 16,
    isFeatured: false,
    isTrending: true,
    isDeal: false,
    isNewArrival: true,
    specifications: {
      fabric: 'Raw Silk & Fine Net',
      care: 'Dry Clean Only',
      occasion: 'Day Wedding / Mehendi',
      pattern: 'Pastel Botanical Threadwork'
    }
  },

  // ===================== 3. SALWAR & KURTIS =====================
  {
    name: 'Burgundy Velvet Embroidered Anarkali Suit',
    brand: 'Velora Heritage',
    category: 'Salwar & Kurtis',
    gender: 'Women',
    price: 2999,
    originalPrice: 5999,
    discountPercent: 50,
    description: 'Floor-sweeping regal anarkali crafted from rich plush velvet, adorned with dabka zari embroidery on the yoke and sleeve cuffs, complete with santoon pants and embroidered organza dupatta.',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Burgundy Wine', hex: '#4C0519' },
      { name: 'Royal Navy', hex: '#172554' }
    ],
    stock: 22,
    rating: 4.9,
    reviewsCount: 31,
    isFeatured: true,
    isTrending: true,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      fabric: 'Plush Micro Velvet',
      care: 'Dry Clean Only',
      occasion: 'Festive / Wedding Guest',
      pattern: 'Royal Zari Threadwork'
    }
  },
  {
    name: 'Mustard Yellow Chanderi Silk Kurta & Palazzo Set',
    brand: 'Velora Studio',
    category: 'Salwar & Kurtis',
    gender: 'Women',
    price: 1899,
    originalPrice: 3499,
    discountPercent: 45,
    description: 'Breezy yet festive Chanderi silk straight-cut kurta with gold foil print motifs, paired with matching wide-leg flared palazzo pants and a sheer chiffon dupatta.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Mustard Gold', hex: '#CA8A04' },
      { name: 'Rani Pink', hex: '#BE185D' }
    ],
    stock: 28,
    rating: 4.7,
    reviewsCount: 20,
    isFeatured: false,
    isTrending: true,
    isDeal: false,
    isNewArrival: true,
    specifications: {
      fabric: 'Chanderi Silk & Cotton Lining',
      care: 'Hand Wash Gently in Cold Water',
      occasion: 'Haldi / Festive Puja',
      pattern: 'Gold Foil Print'
    }
  },
  {
    name: 'Ivory & Gold Chikankari Georgette Sharara Set',
    brand: 'Haute Velora',
    category: 'Salwar & Kurtis',
    gender: 'Women',
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    description: 'Handcrafted Lucknowi Chikankari embroidered short peplum kurti paired with a multi-tiered flared sharara and delicate mukaish work dupatta in timeless ivory and gold.',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory Cream', hex: '#FEF3C7' },
      { name: 'Sky Blue', hex: '#BAE6FD' }
    ],
    stock: 19,
    rating: 4.9,
    reviewsCount: 25,
    isFeatured: true,
    isTrending: false,
    isDeal: true,
    isNewArrival: true,
    specifications: {
      fabric: 'Viscose Georgette',
      care: 'Dry Clean Only',
      occasion: 'Festive / Eid / Reception',
      pattern: 'Authentic Lucknowi Chikankari'
    }
  },

  // ===================== 4. DRESSES =====================
  {
    name: 'Velvet Off-Shoulder Emerald Evening Gown',
    brand: 'Haute Velora',
    category: 'Dresses',
    gender: 'Women',
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    description: 'Floor-length off-shoulder evening gown cut in lustrous stretch velvet with thigh-high slit and sculptural drape detailing for high-glam gala nights.',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Emerald', hex: '#064E3B' },
      { name: 'Black', hex: '#111827' }
    ],
    stock: 24,
    rating: 4.8,
    reviewsCount: 30,
    isFeatured: true,
    isTrending: true,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      fabric: 'Stretch Silk Velvet',
      care: 'Dry Clean Only',
      occasion: 'Evening / Black Tie',
      pattern: 'Solid Draped'
    }
  },
  {
    name: "Women's Crimson Silk Satin Evening Dress",
    brand: 'Haute Velora',
    category: 'Dresses',
    gender: 'Women',
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    description: 'Floor-length silk satin evening gown with thigh slit, flattering halter drape neckline, and criss-cross strappy back.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Crimson Red', hex: '#DC2626' },
      { name: 'Black', hex: '#111827' }
    ],
    stock: 19,
    rating: 4.9,
    reviewsCount: 35,
    isFeatured: true,
    isTrending: true,
    isDeal: false,
    isNewArrival: false,
    specifications: {
      fabric: 'Heavy Silk Satin',
      care: 'Dry Clean Only',
      occasion: 'Party / Evening',
      pattern: 'Solid Lustrous Drape'
    }
  },

  // ===================== 5. JACKETS =====================
  {
    name: "Women's Premium Leather Biker Jacket",
    brand: 'Velora Heritage',
    category: 'Jackets',
    gender: 'Women',
    price: 3499,
    originalPrice: 5999,
    discountPercent: 42,
    description: 'Tailored faux grain leather biker jacket with asymmetric silver zipper, lapel snap buttons, zip sleeve cuffs, and silky satin inner lining.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#111827' }
    ],
    stock: 22,
    rating: 4.9,
    reviewsCount: 42,
    isFeatured: true,
    isTrending: false,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      fabric: 'Top Grade PU Leather & Satin',
      care: 'Wipe with Damp Cloth',
      occasion: 'Casual / Streetwear',
      pattern: 'Asymmetric Zip Biker'
    }
  },
  {
    name: "Women's Classic Denim Jacket",
    brand: 'Velora Studio',
    category: 'Jackets',
    gender: 'Women',
    price: 1299,
    originalPrice: 2499,
    discountPercent: 48,
    description: 'Classic oversized vintage wash blue denim jacket with metallic logo buttons, double chest pockets, and waist adjusters.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Indigo Wash', hex: '#2563EB' }
    ],
    stock: 35,
    rating: 4.8,
    reviewsCount: 24,
    isFeatured: true,
    isTrending: true,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      fabric: '100% Cotton Denim',
      care: 'Machine Wash Cold',
      occasion: 'Casual',
      pattern: 'Vintage Enzyme Wash'
    }
  },
  {
    name: "Men's Suede Double-Breasted Trench Coat",
    brand: 'Velora Atelier',
    category: 'Jackets',
    gender: 'Men',
    price: 3899,
    originalPrice: 7999,
    discountPercent: 51,
    description: 'Double-breasted camel suede winter coat with wide notch lapels, self-fabric waist tie belt, deep handwarmer pockets, and heavy quilted lining.',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Camel Tan', hex: '#D97706' },
      { name: 'Black', hex: '#111827' }
    ],
    stock: 16,
    rating: 4.7,
    reviewsCount: 30,
    isFeatured: true,
    isTrending: true,
    isDeal: false,
    isNewArrival: false,
    specifications: {
      fabric: 'Brushed Faux Suede',
      care: 'Dry Clean Only',
      occasion: 'Winter / Formal',
      pattern: 'Double-Breasted Overcoat'
    }
  },

  // ===================== 6. ACCESSORIES =====================
  {
    name: 'Minimalist Full-Grain Leather Tote Bag',
    brand: 'Velora Accessories',
    category: 'Accessories',
    gender: 'Women',
    price: 2799,
    originalPrice: 4999,
    discountPercent: 44,
    description: 'Structured full-grain leather everyday tote designed with padded 15-inch laptop compartment, inner zip organizer, and magnetic snap closure.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Cognac Brown', hex: '#92400E' },
      { name: 'Obsidian Black', hex: '#111827' }
    ],
    stock: 21,
    rating: 4.8,
    reviewsCount: 27,
    isFeatured: true,
    isTrending: true,
    isDeal: false,
    isNewArrival: false,
    specifications: {
      material: 'Genuine Full-Grain Leather',
      dimensions: '38cm x 30cm x 12cm',
      laptopFit: 'Fits up to 15.6 inch'
    }
  },
  {
    name: 'Designer Top-Grain Leather Pin Buckle Belt',
    brand: 'Velora Accessories',
    category: 'Accessories',
    gender: 'Men',
    price: 999,
    originalPrice: 1999,
    discountPercent: 50,
    description: 'Handcrafted top-grain formal leather belt fitted with heavy brushed gold-tone brass pin buckle and embossed brand crest.',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M (32-34)', 'L (36-38)', 'XL (40-42)'],
    colors: [
      { name: 'Coffee Brown', hex: '#78350F' },
      { name: 'Black', hex: '#111827' }
    ],
    stock: 30,
    rating: 4.7,
    reviewsCount: 19,
    isFeatured: true,
    isTrending: false,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      material: 'Vegetable-Tanned Italian Leather',
      beltWidth: '3.5 cm'
    }
  },

  // ===================== 7. MEN =====================
  {
    name: "Men's Royal Silk Embroidered Kurta Pajama Set",
    brand: 'Velora Studio',
    category: 'Men',
    gender: 'Men',
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    description: 'Mandarin collar royal raw silk men\'s kurta featuring delicate tone-on-tone resham embroidery on the placket and cuffs, accompanied by comfortable white churidar.',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: [
      { name: 'Ivory Gold', hex: '#FEF3C7' },
      { name: 'Royal Navy', hex: '#1E3A8A' }
    ],
    stock: 25,
    rating: 4.8,
    reviewsCount: 22,
    isFeatured: true,
    isTrending: true,
    isDeal: true,
    isNewArrival: true,
    specifications: {
      fabric: 'Raw Dupion Silk Blend',
      care: 'Dry Clean Preferred',
      occasion: 'Festive / Wedding / Diwali'
    }
  },
  {
    name: "Men's Slim Fit Organic Linen Shirt",
    brand: 'Velora Studio',
    category: 'Men',
    gender: 'Men',
    price: 1199,
    originalPrice: 2299,
    discountPercent: 47,
    description: 'Breathable 100% organic French linen casual shirt with band collar, mother-of-pearl buttons, and curved shirt-tail hem.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#93C5FD' }
    ],
    stock: 45,
    rating: 4.6,
    reviewsCount: 15,
    isFeatured: false,
    isTrending: false,
    isDeal: false,
    isNewArrival: false,
    specifications: {
      fabric: '100% Pure Flax Linen',
      care: 'Machine Wash Normal',
      occasion: 'Casual / Resort'
    }
  },

  // ===================== 8. KIDS =====================
  {
    name: 'Kids Denim Overalls Dungaree Set',
    brand: 'Velora Kids',
    category: 'Kids',
    gender: 'Kids',
    price: 799,
    originalPrice: 1599,
    discountPercent: 50,
    description: 'Soft stretch cotton enzyme wash denim dungaree with adjustable metal shoulder buckles, paired with a soft striped cotton inner t-shirt.',
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['2-3 Y', '3-4 Y', '4-5 Y', '5-6 Y', '7-8 Y'],
    colors: [
      { name: 'Classic Blue', hex: '#3B82F6' }
    ],
    stock: 30,
    rating: 4.7,
    reviewsCount: 18,
    isFeatured: true,
    isTrending: false,
    isDeal: true,
    isNewArrival: false,
    specifications: {
      fabric: '100% Breathable Cotton Denim',
      care: 'Machine Wash Gentle'
    }
  }
];

const categoryCoverImages = {
  'Sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'Banarasi Silk Sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'Organza & Floral Sarees': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
  'Bandhani & Patola Sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'Georgette Ready-to-Wear': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  'Lehenga Sets': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'Bridal Heritage Lehengas': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'Sangeet & Cocktail Lehengas': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'Velvet Winter Lehengas': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'Salwar & Kurtis': 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
  'Dresses': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  'Jackets': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  'Men': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  'Kids': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'
};

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log('[Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('[Script] Connected successfully.');

    // 1. Update Category cover images
    console.log('[Script] Updating Category images...');
    for (const [catName, imgUrl] of Object.entries(categoryCoverImages)) {
      await Category.updateOne({ name: catName }, { $set: { image: imgUrl } });
    }
    console.log('[Script] Category images updated.');

    // 2. Remove any old products with bad/broken images if needed, or upsert realistic products
    console.log('[Script] Seeding/Updating products per category...');
    for (const item of realisticProducts) {
      await Product.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { upsert: true, new: true }
      );
    }
    console.log(`[Script] Successfully populated ${realisticProducts.length} high-quality products across all categories!`);

    const total = await Product.countDocuments();
    const categories = await Product.distinct('category');
    console.log(`[Script] Total products in database: ${total}`);
    console.log(`[Script] Categories now covered:`, categories);

    process.exit(0);
  } catch (err) {
    console.error('[Script] Error:', err);
    process.exit(1);
  }
}

run();
