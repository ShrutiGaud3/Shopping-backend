const HomeSection = require('../models/HomeSection');
const Product = require('../models/Product');

// @desc    Get active home sections for storefront
// @route   GET /api/home-sections
// @access  Public
exports.getHomeSections = async (req, res) => {
  try {
    const sections = await HomeSection.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Populate products for product_grid sections
    const enrichedSections = await Promise.all(
      sections.map(async (sec) => {
        if (sec.type === 'product_grid') {
          let filter = {};
          const filterBy = sec.config?.filterBy || 'trending';
          const limit = sec.config?.limit || 8;

          if (filterBy === 'trending') {
            filter.isTrending = true;
          } else if (filterBy === 'deal') {
            filter.isDeal = true;
          } else if (filterBy === 'new') {
            filter.isNew = true;
          } else if (filterBy === 'category' && sec.config?.category) {
            filter.category = new RegExp(sec.config.category, 'i');
          }

          let products = await Product.find(filter).limit(limit).lean();

          // Fallback if specific filter returns 0 products
          if (products.length === 0) {
            products = await Product.find().limit(limit).lean();
          }

          return {
            ...sec,
            products
          };
        }
        return sec;
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedSections.length,
      data: enrichedSections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching home sections',
      error: error.message
    });
  }
};

// @desc    Get all home sections (Admin)
// @route   GET /api/home-sections/admin
// @access  Private/Admin
exports.getAllHomeSectionsAdmin = async (req, res) => {
  try {
    const sections = await HomeSection.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching home sections',
      error: error.message
    });
  }
};

// @desc    Create new home section
// @route   POST /api/home-sections
// @access  Private/Admin
exports.createHomeSection = async (req, res) => {
  try {
    const section = await HomeSection.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Home section created successfully',
      data: section
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating home section',
      error: error.message
    });
  }
};

// @desc    Update home section
// @route   PUT /api/home-sections/:id
// @access  Private/Admin
exports.updateHomeSection = async (req, res) => {
  try {
    const section = await HomeSection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Home section not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Home section updated successfully',
      data: section
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating home section',
      error: error.message
    });
  }
};

// @desc    Delete home section
// @route   DELETE /api/home-sections/:id
// @access  Private/Admin
exports.deleteHomeSection = async (req, res) => {
  try {
    const section = await HomeSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Home section not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Home section deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting home section',
      error: error.message
    });
  }
};
