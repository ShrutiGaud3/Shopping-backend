const mongoose = require('mongoose');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Mongoose Models
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://shrutigaud3_db_user:n19LR0L83Mp85Xbi@cluster0.f7jrpu4.mongodb.net/fashion_ecommerce?retryWrites=true&w=majority&appName=Cluster0';
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    console.log('[Seed] Wiping old collection data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();

    // 1. Create Users (Admin & Customer)
    console.log('[Seed] Seeding Users...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@velora.com',
      phone: '9876543210',
      password: 'Admin@123',
      role: 'admin'
    });

    const customerUser = await User.create({
      name: 'Customer User',
      email: 'customer@example.com',
      phone: '9876543210',
      password: 'password123',
      role: 'customer',
      addresses: [
        {
          name: 'Customer User',
          phone: '9876543210',
          address: '123 Velvet Boulevard, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          isDefault: true
        }
      ]
    });

    console.log(`[Seed] Created Admin (${adminUser.email}) and Customer (${customerUser.email}).`);

    // 2. Create Categories
    console.log('[Seed] Seeding Categories...');
    const categoriesData = [
      { name: 'Women', slug: 'women', gender: 'Women', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', description: 'Women Fashion & Styles' },
      { name: 'Men', slug: 'men', gender: 'Men', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', description: 'Men Fashion & Suits' },
      { name: 'Kids', slug: 'kids', gender: 'Kids', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80', description: 'Kids Clothing & Dungarees' },
      { name: 'Dresses', slug: 'dresses', gender: 'Women', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', description: 'Evening & Casual Dresses' },
      { name: 'Jackets', slug: 'jackets', gender: 'All', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', description: 'Coats & Outerwear' },
      { name: 'Accessories', slug: 'accessories', gender: 'All', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', description: 'Bags & Jewellery' }
    ];
    await Category.insertMany(categoriesData);

    // 3. Create Products
    console.log('[Seed] Seeding Products...');
    const productsData = [
      {
        name: "Women's Denim Jacket",
        brand: 'Velora Studio',
        category: 'Jackets',
        gender: 'Women',
        price: 1299,
        originalPrice: 2499,
        discountPercent: 48,
        description: 'Classic oversized wash denim jacket with silver buttons and chest flap pockets.',
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Blue', hex: '#3B82F6' },
          { name: 'Black', hex: '#111827' }
        ],
        stock: 35,
        rating: 4.8,
        reviewsCount: 24,
        isFeatured: true,
        isTrending: true,
        isDeal: true
      },
      {
        name: "Women's Crimson Evening Dress",
        brand: 'Haute Velora',
        category: 'Dresses',
        gender: 'Women',
        price: 2499,
        originalPrice: 4999,
        discountPercent: 50,
        description: 'Floor-length silk satin evening gown with thigh slit and elegant drape neckline.',
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L'],
        colors: [
          { name: 'Red', hex: '#EF4444' },
          { name: 'Black', hex: '#111827' }
        ],
        stock: 20,
        rating: 4.9,
        reviewsCount: 18,
        isFeatured: true,
        isTrending: true,
        isDeal: false
      },
      {
        name: "Men's Suede Trench Coat",
        brand: 'Velora Atelier',
        category: 'Jackets',
        gender: 'Men',
        price: 3899,
        originalPrice: 7999,
        discountPercent: 51,
        description: 'Double-breasted camel suede coat with waist belt and heavy inner lining.',
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
        sizes: ['M', 'L', 'XL'],
        colors: [
          { name: 'Beige', hex: '#F5F5DC' },
          { name: 'Black', hex: '#111827' }
        ],
        stock: 15,
        rating: 4.7,
        reviewsCount: 30,
        isFeatured: true,
        isTrending: true,
        isDeal: false
      },
      {
        name: "Men's Urban Utility Bomber",
        brand: 'Velora Urban',
        category: 'Jackets',
        gender: 'Men',
        price: 1899,
        originalPrice: 3499,
        discountPercent: 45,
        description: 'Water-resistant nylon bomber with zip arm sleeve pocket and ribbed hems.',
        images: ['https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Green', hex: '#10B981' },
          { name: 'Black', hex: '#111827' }
        ],
        stock: 40,
        rating: 4.6,
        reviewsCount: 12,
        isFeatured: false,
        isTrending: true,
        isDeal: true
      },
      {
        name: "Women's Leather Biker Jacket",
        brand: 'Velora Heritage',
        category: 'Jackets',
        gender: 'Women',
        price: 2999,
        originalPrice: 5999,
        discountPercent: 50,
        description: '100% genuine faux leather jacket with asymmetric zip and metallic studs.',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
          { name: 'Black', hex: '#111827' }
        ],
        stock: 18,
        rating: 4.9,
        reviewsCount: 42,
        isFeatured: true,
        isTrending: false,
        isDeal: false
      },
      {
        name: "Women's Silk Satin Wrap Blouse",
        brand: 'Haute Velora',
        category: 'Shirts',
        gender: 'Women',
        price: 1499,
        originalPrice: 2999,
        discountPercent: 50,
        description: 'V-neck wrap blouse with balloon sleeves and tie-side fastening.',
        images: ['https://images.unsplash.com/photo-1485968530198-444458f38198?auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L'],
        colors: [
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Beige', hex: '#F5F5DC' }
        ],
        stock: 25,
        rating: 4.5,
        reviewsCount: 9,
        isFeatured: false,
        isTrending: true,
        isDeal: true
      },
      {
        name: "Men's Slim Fit Linen Shirt",
        brand: 'Velora Studio',
        category: 'Shirts',
        gender: 'Men',
        price: 1199,
        originalPrice: 2299,
        discountPercent: 47,
        description: 'Breathable 100% organic linen mandarin collar casual shirt.',
        images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Blue', hex: '#3B82F6' }
        ],
        stock: 50,
        rating: 4.4,
        reviewsCount: 15,
        isFeatured: false,
        isTrending: false,
        isDeal: false
      },
      {
        name: "Kids Denim Overalls Dungaree",
        brand: 'Velora Kids',
        category: 'Bottoms',
        gender: 'Kids',
        price: 799,
        originalPrice: 1599,
        discountPercent: 50,
        description: 'Soft stretch cotton denim dungaree for toddlers and boys.',
        images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L'],
        colors: [
          { name: 'Blue', hex: '#3B82F6' }
        ],
        stock: 30,
        rating: 4.8,
        reviewsCount: 8,
        isFeatured: true,
        isTrending: false,
        isDeal: true
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`[Seed] Created ${createdProducts.length} Products.`);

    // 4. Create Coupons
    console.log('[Seed] Seeding Coupons...');
    const couponsData = [
      { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minimumOrderValue: 500, maximumDiscount: 500 },
      { code: 'VELORA20', discountType: 'percentage', discountValue: 20, minimumOrderValue: 2000, maximumDiscount: 1000 },
      { code: 'FLAT500', discountType: 'fixed', discountValue: 500, minimumOrderValue: 3000, maximumDiscount: 500 }
    ];
    await Coupon.insertMany(couponsData);

    // 5. Create Product Reviews
    console.log('[Seed] Seeding Sample Reviews...');
    const firstProduct = createdProducts[0];
    await Review.create({
      user: customerUser._id,
      userName: customerUser.name,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      userLocation: 'Mumbai, Maharashtra',
      product: firstProduct._id,
      productName: firstProduct.name,
      rating: 5,
      comment: 'The quality of the Women’s Denim Jacket exceeded my expectations! The denim feels sturdy yet ultra-soft.',
      isVerifiedPurchase: true
    });

    console.log('[Seed] Database Seeding Completed Successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
