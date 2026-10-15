const TrustBadge = require('../models/TrustBadge');

// @desc    Get all active trust badges
// @route   GET /api/trust-badges
// @access  Public
exports.getTrustBadges = async (req, res) => {
  try {
    const badges = await TrustBadge.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: badges.length,
      data: badges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching trust badges',
      error: error.message
    });
  }
};

// @desc    Get all trust badges (Admin)
// @route   GET /api/trust-badges/admin
// @access  Private/Admin
exports.getAllTrustBadgesAdmin = async (req, res) => {
  try {
    const badges = await TrustBadge.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: badges.length,
      data: badges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching trust badges',
      error: error.message
    });
  }
};

// @desc    Create new trust badge
// @route   POST /api/trust-badges
// @access  Private/Admin
exports.createTrustBadge = async (req, res) => {
  try {
    const badge = await TrustBadge.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Trust badge created successfully',
      data: badge
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating trust badge',
      error: error.message
    });
  }
};

// @desc    Update trust badge
// @route   PUT /api/trust-badges/:id
// @access  Private/Admin
exports.updateTrustBadge = async (req, res) => {
  try {
    const badge = await TrustBadge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Trust badge not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trust badge updated successfully',
      data: badge
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating trust badge',
      error: error.message
    });
  }
};

// @desc    Delete trust badge
// @route   DELETE /api/trust-badges/:id
// @access  Private/Admin
exports.deleteTrustBadge = async (req, res) => {
  try {
    const badge = await TrustBadge.findByIdAndDelete(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Trust badge not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trust badge deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting trust badge',
      error: error.message
    });
  }
};
