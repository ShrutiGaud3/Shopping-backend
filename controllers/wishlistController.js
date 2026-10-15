const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      data: wishlist.products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add or toggle product in wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const existsIndex = wishlist.products.findIndex(
      (p) => p.toString() === productId
    );

    let message = '';
    if (existsIndex > -1) {
      wishlist.products.splice(existsIndex, 1);
      message = 'Product removed from wishlist';
    } else {
      wishlist.products.push(productId);
      message = 'Product added to wishlist';
    }

    await wishlist.save();
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      success: true,
      message,
      data: updatedWishlist.products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== productId
      );
      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: updatedWishlist ? updatedWishlist.products : []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = [];
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist
};
