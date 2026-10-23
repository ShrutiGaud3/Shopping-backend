const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'velora_super_secret_jwt_key_2026');
      req.user = await User.findById(decoded.id).select('-password');

      if (req.user) {
        return next();
      }
    } catch (error) {
      console.error('[Auth Protect Error]', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Session expired or invalid token'
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Not authorized: Please sign in to proceed'
  });
};

const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'velora_super_secret_jwt_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      req.user = undefined;
    }
  } else {
    req.user = undefined;
  }

  next();
};

module.exports = { protect, optionalProtect };

