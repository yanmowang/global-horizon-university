const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and check admin role
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload to request
    req.user = decoded.user;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied, admin privileges required',
      });
    }

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid',
    });
  }
};
