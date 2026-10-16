// Middleware to enforce Admin / Manager role authorization
const adminOnly = (req, res, next) => {
  if (req.user && ['manager', 'admin', 'superadmin'].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Administrative privileges required'
  });
};

// Middleware to enforce Super Admin role authorization
const superAdminOnly = (req, res, next) => {
  if (req.user && ['superadmin', 'admin'].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Super Admin authorization required'
  });
};

module.exports = {
  adminOnly,
  superAdminOnly
};
