const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true }
});

const stitchOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    default: 'Unstitched'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    default: 'Standard fabric material provided'
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name'],
    default: 'Weavera',
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    trim: true
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
    trim: true
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
    default: '',
    trim: true
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 12
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

  // Ethnic Wear Specialization Fields
  fabric: {
    type: String,
    default: 'Banarasi Silk',
    trim: true
  },
  work: {
    type: String,
    default: 'Zari Weaving',
    trim: true
  },
  occasion: {
    type: String,
    default: 'Festive & Wedding',
    trim: true
  },
  washCare: {
    type: String,
    default: 'Dry Clean Only',
    trim: true
  },
  setContents: {
    type: String,
    default: '1 Saree with Blouse Piece',
    trim: true
  },
  sareeLength: {
    type: String,
    default: '5.5 Meters + 0.8 Meter Blouse Piece',
    trim: true
  },
  lehengaFlare: {
    type: String,
    default: '',
    trim: true
  },
  dispatchTime: {
    type: String,
    default: 'Ready to Dispatch in 24 Hours',
    trim: true
  },
  videoUrl: {
    type: String,
    default: '',
    trim: true
  },
  stitchOptions: [stitchOptionSchema],
  deliveryInfo: {
    estimatedDays: { type: Number, default: 4 },
    isCodAvailable: { type: Boolean, default: true },
    freeShipping: { type: Boolean, default: true }
  },

  // General Specifications for Accessories & Western Wear
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
  }
}, {
  timestamps: true
});

// Performance & Full-Text Search Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({
  name: 'text',
  description: 'text',
  fabric: 'text',
  work: 'text',
  occasion: 'text'
});

module.exports = mongoose.model('Product', productSchema);
