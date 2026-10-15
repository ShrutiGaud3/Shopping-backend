const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Fetch all products with filtering, search, pagination, sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      gender,
      size,
      color,
      brand,
      minPrice,
      maxPrice,
      rating,
      minDiscount,
      sort,
      page = 1,
      limit = 24
    } = req.query;

    const query = {};

    // 1. Search filter (Name, Brand, Category, Description)
    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Category Filter (Smartly handles Women, Men, Kids when passed as category parameter)
    if (category) {
      const catList = (Array.isArray(category) ? category.join(',') : String(category)).split(',').filter(Boolean);
      if (catList.length > 0) {
        const genderSectionMatches = catList.filter(c => ['women', 'men', 'kids', 'unisex'].includes(c.toLowerCase().trim()));
        const categoryMatches = catList.filter(c => !['women', 'men', 'kids', 'unisex'].includes(c.toLowerCase().trim()));

        if (genderSectionMatches.length > 0) {
          const genderRegexes = genderSectionMatches.map(g => new RegExp(`^${g.trim()}`, 'i'));
          query.gender = { $in: genderRegexes };
        }

        if (categoryMatches.length > 0) {
          const catRegexes = categoryMatches.map(c => new RegExp(c.trim().split(' ')[0], 'i'));
          query.category = { $in: catRegexes };
        }
      }
    }

    // 3. Gender / Section Filter
    if (gender) {
      const genderList = (Array.isArray(gender) ? gender.join(',') : String(gender)).split(',').filter(Boolean);
      if (genderList.length > 0) {
        const regexList = genderList.map(g => new RegExp(`^${g.trim()}`, 'i'));
        query.gender = { $in: regexList };
      }
    }

    // 4. Size filter
    if (size) {
      if (Array.isArray(size)) {
        query.sizes = { $in: size };
      } else {
        query.sizes = size;
      }
    }

    // 5. Color filter
    if (color) {
      if (Array.isArray(color)) {
        query['colors.name'] = { $in: color };
      } else {
        query['colors.name'] = color;
      }
    }

    // 6. Brand filter
    if (brand) {
      if (Array.isArray(brand)) {
        query.brand = { $in: brand };
      } else {
        query.brand = brand;
      }
    }

    // 7. Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 8. Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 9. Minimum Discount filter
    if (minDiscount) {
      query.discountPercent = { $gte: Number(minDiscount) };
    }

    // 10. Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'priceLow') sortOptions = { price: 1 };
    if (sort === 'priceHigh') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'discount') sortOptions = { discountPercent: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum) || 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found (Invalid ID format)'
      });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json({
        success: true,
        data: product
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a new product (Admin Only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a product (Admin Only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id);
    }

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    }

    // Fallback: create as new MongoDB product if ID was non-ObjectId
    const newDoc = new Product(req.body);
    const savedDoc = await newDoc.save();
    return res.status(200).json({
      success: true,
      message: 'Product updated and persisted to database',
      data: savedDoc
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a product (Admin Only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Product.findByIdAndDelete(req.params.id);
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
