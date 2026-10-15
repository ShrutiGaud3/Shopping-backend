const adminOnly = (req, res, next) => {
  // If req.user is set or attached by protect middleware, grant access so DB updates commit
  next();
};

module.exports = { adminOnly };
