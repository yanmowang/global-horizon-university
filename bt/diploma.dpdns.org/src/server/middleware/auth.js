const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and protect routes
module.exports = async (req, res, next) => {
  try {
    let token;

    // 尝试从多个来源获取token
    // 1. 从Authorization头获取
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('从Authorization头获取token');
    }
    // 2. 从cookie获取
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('从cookies获取token');
    }
    // 3. 从查询参数获取（对于下载直接链接很有用）
    else if (req.query && req.query.token) {
      token = req.query.token;
      console.log('从query参数获取token');
    }

    console.log('Token status:', token ? '已找到' : '未找到');

    // 检查token是否存在
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied',
      });
    }

    try {
      // 验证TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // 将用户信息添加到req对象，后续中间件可以访问
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);

      return res.status(401).json({
        success: false,
        message: 'Token is invalid',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
