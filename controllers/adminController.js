const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get executive admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate revenue
    const paidOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['Pending', 'Confirmed', 'Packed'] } });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });

    // Fetch recent 10 orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        lowStockProducts,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get inventory status
// @route   GET /api/admin/inventory
// @access  Private/Admin
const getInventory = async (req, res) => {
  try {
    const products = await Product.find().select('name brand category price stock sku rating images').sort({ stock: 1 });

    const formattedInventory = products.map((p) => {
      let status = 'In Stock';
      if (p.stock === 0) status = 'Out of Stock';
      else if (p.stock <= 10) status = 'Low Stock';

      return {
        id: p._id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        stock: p.stock,
        sku: p.sku || `SKU-${p._id.toString().slice(-6).toUpperCase()}`,
        status,
        image: p.images[0] || ''
      };
    });

    res.status(200).json({
      success: true,
      data: formattedInventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product stock quantity
// @route   PUT /api/admin/inventory/:productId
// @access  Private/Admin
const updateInventoryStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const clampedStock = Math.max(0, Number(stock || 0));

    let product = null;
    if (mongoose.Types.ObjectId.isValid(req.params.productId)) {
      product = await Product.findByIdAndUpdate(
        req.params.productId,
        { stock: clampedStock },
        { new: true }
      );
    }

    if (!product) {
      product = await Product.findOneAndUpdate(
        { name: req.body.name },
        { stock: clampedStock },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: `Stock level updated to ${stock}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all registered users (Admin Only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user account (Admin Only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUserAdmin = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAdminDashboard,
  getInventory,
  updateInventoryStock,
  getAllUsersAdmin,
  deleteUserAdmin
};
