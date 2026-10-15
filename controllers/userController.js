const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.body.addresses) {
        user.addresses = req.body.addresses;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          addresses: updatedUser.addresses,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
