const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    // 获取请求头中的Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问，缺少有效令牌' });
    }
    
    // 提取令牌
    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: '未找到用户' });
    }
    
    // 验证用户是否为管理员
    if (user.role !== 'admin') {
      return res.status(403).json({ message: '访问被拒绝，需要管理员权限' });
    }
    
    // 将用户数据附加到req
    req.user = user;
    
    next();
  } catch (error) {
    console.error('管理员认证错误:', error);
    return res.status(401).json({ message: '未授权访问' });
  }
};

module.exports = adminAuth; 