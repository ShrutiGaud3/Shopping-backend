const Marquee = require('../models/Marquee');

// Fallback initial marquee items
const defaultMarquees = [
  { text: 'FREE SHIPPING ON ALL ORDERS ABOVE ₹999', link: '/products', icon: 'Truck', order: 1, isActive: true },
  { text: '10-DAYS EASY SIZE EXCHANGE GUARANTEE', link: '/pages/refund-policy', icon: 'RotateCcw', order: 2, isActive: true },
  { text: 'NEW ARRIVALS: FESTIVE & BRIDAL LEHENGA SETS LIVE', link: '/products?category=Lehengas', icon: 'Sparkles', order: 3, isActive: true },
  { text: '100% HANDCRAFTED SURAT TEXTILE ASSURED', link: '/pages/about-us', icon: 'ShieldCheck', order: 4, isActive: true }
];

// @desc    Get active marquee items for public ticker
// @route   GET /api/marquee
// @access  Public
const getMarquees = async (req, res) => {
  try {
    let items = await Marquee.find({ isActive: true }).sort({ order: 1 });
    if (items.length === 0) {
      // Auto seed defaults
      await Marquee.insertMany(defaultMarquees);
      items = await Marquee.find({ isActive: true }).sort({ order: 1 });
    }
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: defaultMarquees
    });
  }
};

// @desc    Get all marquee items (Admin)
// @route   GET /api/marquee/all
// @access  Private/Admin
const getAllMarqueesAdmin = async (req, res) => {
  try {
    const items = await Marquee.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create marquee item
// @route   POST /api/marquee
// @access  Private/Admin
const createMarquee = async (req, res) => {
  try {
    const item = await Marquee.create(req.body);
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update marquee item
// @route   PUT /api/marquee/:id
// @access  Private/Admin
const updateMarquee = async (req, res) => {
  try {
    const item = await Marquee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Marquee item not found' });
    }
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete marquee item
// @route   DELETE /api/marquee/:id
// @access  Private/Admin
const deleteMarquee = async (req, res) => {
  try {
    const item = await Marquee.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Marquee item not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Marquee item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMarquees,
  getAllMarqueesAdmin,
  createMarquee,
  updateMarquee,
  deleteMarquee
};
