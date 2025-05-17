const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ForumPost = require('../models/ForumPost');
const Certificate = require('../models/Certificate');

// Helper function to generate JWT token
const generateToken = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    // Create new user (password will be hashed in the model)
    user = new User({
      name,
      email,
      password,
      role: 'user', // Default role
    });

    await user.save();

    // 创建一个示例证书
    try {
      await Certificate.create({
        userId: user._id,
        certificateType: 'professional',
        program: '示例证书 - Web开发基础',
        status: 'issued',
        metadata: {
          graduationDate: new Date(),
          gpa: 3.8,
          honors: '优秀',
          additionalInfo: '这是一个示例证书',
        },
      });

      // 再添加一个待审核状态的证书
      await Certificate.create({
        userId: user._id,
        certificateType: 'bachelor',
        program: '示例证书 - 计算机科学与技术',
        status: 'pending',
        metadata: {
          graduationDate: new Date(),
          gpa: 3.9,
          honors: '优秀',
          additionalInfo: '这是一个待审核的示例证书',
        },
      });
    } catch (certError) {
      console.error('Error creating sample certificate:', certError);
      // 继续处理，不影响用户注册
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      token,
      data: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      token,
      data: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

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
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Set new password (will be hashed in the model)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// 获取所有帖子
exports.getAllPosts = async (req, res) => {
  try {
    // 支持分类过滤
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // 支持分页
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 获取帖子并填充作者信息
    const posts = await ForumPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name')
      .lean();

    // 获取总数用于分页
    const total = await ForumPost.countDocuments(filter);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// 获取单个帖子详情
exports.getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.author', 'name')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // 检查当前用户是否已点赞
    if (req.user && req.user.id) {
      post.hasUpvoted = post.upvotes.some(upvote => upvote.toString() === req.user.id.toString());
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get forum post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// 创建新帖子
exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // 验证输入
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content and category',
      });
    }

    // 创建新帖子
    const post = new ForumPost({
      title,
      content,
      category,
      author: req.user.id,
    });

    await post.save();

    // 返回带作者信息的帖子
    const populatedPost = await ForumPost.findById(post._id).populate('author', 'name').lean();

    res.status(201).json({
      success: true,
      data: populatedPost,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Create forum post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// 添加评论
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // 添加评论
    post.comments.push({
      content,
      author: req.user.id,
    });

    await post.save();

    // 返回带作者信息的帖子
    const updatedPost = await ForumPost.findById(post._id)
      .populate('author', 'name')
      .populate('comments.author', 'name')
      .lean();

    res.json({
      success: true,
      data: updatedPost,
      message: 'Comment added successfully',
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// 点赞/取消点赞
exports.toggleUpvote = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // 检查用户是否已点赞
    const upvoteIndex = post.upvotes.findIndex(upvote => upvote.toString() === req.user.id);

    if (upvoteIndex === -1) {
      // 添加点赞
      post.upvotes.push(req.user.id);
    } else {
      // 取消点赞
      post.upvotes.splice(upvoteIndex, 1);
    }

    await post.save();

    res.json({
      success: true,
      upvoteCount: post.upvotes.length,
      hasUpvoted: upvoteIndex === -1, // 如果之前没有点赞，现在就是已点赞
    });
  } catch (error) {
    console.error('Toggle upvote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};
