const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size = 'M', color = 'Default' } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Product ID format. Please copy a valid product _id from GET /api/products'
      });
    }

    // Check product existence and stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} items remaining.`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item with same productId, size, color exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        size,
        color
      });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update cart item quantity or options (matches cart item _id OR product _id)
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity, size, color } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const targetId = req.params.itemId;
    const item = cart.items.find(
      (i) => i._id.toString() === targetId || (i.product && i.product.toString() === targetId)
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found in your cart'
      });
    }

    if (quantity !== undefined && quantity <= 0) {
      cart.items.pull(item._id);
    } else {
      if (quantity !== undefined) item.quantity = Number(quantity);
      if (size) item.size = size;
      if (color) item.color = color;
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove item from cart (matches cart item _id OR product _id)
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const targetId = req.params.itemId;
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== targetId && (item.product && item.product.toString() !== targetId)
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
