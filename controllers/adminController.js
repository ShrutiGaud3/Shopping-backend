const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Subscriber = require('../models/Subscriber');

// @desc    Get executive admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Run aggregations and counts in parallel
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      todayOrders,
      allPaidOrders,
      todayPaidOrders,
      pendingOrders,
      exchangeRequests,
      pendingReviews,
      totalSubscribers,
      todaySubscribers,
      lowStockProducts,
      lowStockCount,
      recentOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.find({ orderStatus: { $ne: 'Cancelled' } }).select('totalAmount'),
      Order.find({ createdAt: { $gte: startOfDay }, orderStatus: { $ne: 'Cancelled' } }).select('totalAmount'),
      Order.countDocuments({ orderStatus: { $in: ['Placed', 'Pending', 'Confirmed', 'Packed'] } }),
      Order.countDocuments({ exchangeStatus: 'requested' }),
      Review.countDocuments({ status: 'pending' }),
      Subscriber.countDocuments({ status: 'active' }),
      Subscriber.countDocuments({ createdAt: { $gte: startOfDay } }),
      Product.find({ stock: { $lte: 10 } })
        .select('name images brand category price stock sku rating')
        .sort({ stock: 1 })
        .limit(8),
      Product.countDocuments({ stock: { $lte: 10 } }),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    const totalRevenue = allPaidOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const todayRevenue = todayPaidOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        todayRevenue,
        totalOrders,
        todayOrders,
        pendingOrders,
        exchangeRequests,
        pendingReviews,
        totalUsers,
        totalProducts,
        lowStockCount,
        lowStockProducts,
        totalSubscribers,
        todaySubscribers,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error in getAdminDashboard:', error);
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

// @desc    Update user role (Super Admin Only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/SuperAdmin
const updateUserRoleAdmin = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'manager', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be customer, manager, admin, or superadmin'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
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
  updateUserRoleAdmin,
  deleteUserAdmin
};
