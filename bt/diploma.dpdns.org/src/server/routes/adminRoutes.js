const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Certificate = require('../models/Certificate');

// 获取管理员仪表板数据
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // 获取总证书数
    const totalCertificates = await Certificate.countDocuments();
    
    // 获取总用户数
    const totalUsers = await User.countDocuments();
    
    // 获取最近30天的证书
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCertificates = await Certificate.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // 计算收入 (模拟)
    const revenue = totalCertificates * 50; // 假设每个证书50元
    
    // 返回仪表板数据
    res.json({
      totalCertificates,
      totalUsers,
      recentCertificates,
      revenue
    });
  } catch (error) {
    console.error('获取仪表板数据错误:', error);
    res.status(500).json({ message: '获取仪表板数据时出错' });
  }
});

// 获取所有证书
router.get('/certificates', adminAuth, async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    res.json(certificates);
  } catch (error) {
    console.error('获取证书错误:', error);
    res.status(500).json({ message: '获取证书列表时出错' });
  }
});

// 获取所有用户
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('获取用户错误:', error);
    res.status(500).json({ message: '获取用户列表时出错' });
  }
});

// 验证当前用户是否为管理员
router.get('/check-admin', adminAuth, (req, res) => {
  res.json({ isAdmin: true });
});

// POST /api/admin/users - Create a new user
router.post('/users', adminAuth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'user',
    });

    await user.save();

    // Don't return password in the response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

// PUT /api/admin/users/:id - Update a user
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (role) userFields.role = role;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete yourself',
      });
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

// DELETE /api/admin/certificates/:id - Delete a certificate
router.delete('/certificates/:id', adminAuth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    await Certificate.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

// 创建新证书
router.post('/certificates', adminAuth, async (req, res) => {
  try {
    const { userId, program, certificateType, status, issueDate } = req.body;
    
    // 校验必填字段
    if (!userId || !program || !certificateType) {
      return res.status(400).json({
        success: false,
        message: '请提供用户ID、项目名称和证书类型',
      });
    }
    
    // 校验用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
    
    // 创建新证书
    const certificate = new Certificate({
      userId,
      program,
      certificateType,
      status: status || 'pending',
      issueDate: issueDate || new Date(),
    });
    
    await certificate.save();
    
    res.status(201).json({
      success: true,
      data: certificate,
      message: '证书创建成功',
    });
  } catch (error) {
    console.error('创建证书错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

// 获取单个证书详情
router.get('/certificates/:id', adminAuth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: '证书不存在',
      });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('获取证书详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

// 更新证书
router.put('/certificates/:id', adminAuth, async (req, res) => {
  try {
    const { userId, program, certificateType, status, issueDate } = req.body;
    
    // 构建更新对象
    const updateData = {};
    if (userId) updateData.userId = userId;
    if (program) updateData.program = program;
    if (certificateType) updateData.certificateType = certificateType;
    if (status) updateData.status = status;
    if (issueDate) updateData.issueDate = issueDate;
    
    // 查找并更新证书
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: '证书不存在',
      });
    }
    
    res.json({
      success: true,
      data: certificate,
      message: '证书更新成功',
    });
  } catch (error) {
    console.error('更新证书错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

module.exports = router;
