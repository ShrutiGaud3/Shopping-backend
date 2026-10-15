const Banner = require('../models/Banner');

// @desc    Get all active banners for storefront
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching banners',
      error: error.message
    });
  }
};

// @desc    Get all banners (Admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
exports.getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching banners',
      error: error.message
    });
  }
};

// @desc    Create new banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating banner',
      error: error.message
    });
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating banner',
      error: error.message
    });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting banner',
      error: error.message
    });
  }
};
