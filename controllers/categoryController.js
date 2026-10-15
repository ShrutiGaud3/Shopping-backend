const Category = require('../models/Category');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ order: 1, name: 1 }).populate('parent', 'name slug');
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get Nested Category Tree for Mega Menu & Navigation
// @route   GET /api/categories/tree
// @access  Public
const getCategoryTree = async (req, res) => {
  try {
    const allCategories = await Category.find({ isActive: true, showInMenu: true })
      .sort({ order: 1, name: 1 })
      .lean();

    const categoryMap = {};
    const rootCategories = [];

    allCategories.forEach((cat) => {
      categoryMap[cat._id.toString()] = {
        ...cat,
        children: []
      };
    });

    allCategories.forEach((cat) => {
      const catObj = categoryMap[cat._id.toString()];
      if (cat.parent && categoryMap[cat.parent.toString()]) {
        categoryMap[cat.parent.toString()].children.push(catObj);
      } else {
        rootCategories.push(catObj);
      }
    });

    res.status(200).json({
      success: true,
      data: rootCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create category (Admin Only)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (!payload.parent) {
      payload.parent = null;
    }

    const category = new Category(payload);
    const createdCategory = await category.save();
    res.status(201).json({
      success: true,
      data: createdCategory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update category (Admin Only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (payload.parent === '' || payload.parent === 'null') {
      payload.parent = null;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete category (Admin Only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    // Also unset any children pointing to this category
    await Category.updateMany({ parent: req.params.id }, { $set: { parent: null } });
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory
};
