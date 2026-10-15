const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name'],
    default: 'Velora Studio'
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['Jackets', 'Dresses', 'Shirts', 'T-Shirts', 'Bottoms', 'Accessories', 'Shoes']
  },
  gender: {
    type: String,
    required: [true, 'Please specify gender/section'],
    enum: ['Women', 'Men', 'Kids', 'Unisex'],
    default: 'Women'
  },
  price: {
    type: Number,
    required: [true, 'Please provide sale price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please provide original MRP price'],
    min: 0
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
  }],
  colors: [colorSchema],
  stock: {
    type: Number,
    required: [true, 'Please specify stock quantity'],
    default: 25,
    min: 0
  },
  sku: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isDeal: {
    type: Boolean,
    default: false
  },
  specifications: {
    fabric: { type: String, default: 'Cotton Blend' },
    care: { type: String, default: 'Dry Clean Only' },
    sleeveLength: { type: String, default: 'Full Sleeves' },
    collar: { type: String, default: 'Regular Collar' },
    pattern: { type: String, default: 'Solid' },
    fit: { type: String, default: 'Regular Fit' },
    pockets: { type: String, default: 'Side Pockets' },
    occasion: { type: String, default: 'Casual / Evening' },
    lining: { type: String, default: 'Polyester Satin' },
    closure: { type: String, default: 'Front Zip / Buttons' },
    // Accessory & Bag Specifications
    material: { type: String, default: 'Premium Metal / Italian Leather' },
    lensMaterial: { type: String, default: 'Polycarbonate / TAC' },
    frameShape: { type: String, default: 'Wayfarer / Aviator' },
    uvProtection: { type: String, default: 'UV400 Protected' },
    dimensions: { type: String, default: 'Standard Size' },
    warranty: { type: String, default: '1 Year Brand Warranty' },
    strapMaterial: { type: String, default: 'Genuine Leather / Stainless Steel' },
    buckleType: { type: String, default: 'Pin Buckle / Magnetic' },
    bagStyle: { type: String, default: 'Tote / Crossbody / Backpack' },
    compartments: { type: String, default: '2 Main Zip Compartments' },
    laptopFit: { type: String, default: 'Fits up to 15" Laptop' },
    hardware: { type: String, default: 'Gold-Tone Brushed Metal' },
    beltWidth: { type: String, default: '3.5 cm' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
