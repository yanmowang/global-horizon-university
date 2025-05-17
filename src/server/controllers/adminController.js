const User = require('../models/User');
const Certificate = require('../models/Certificate');

// Get dashboard statistics
exports.getStatistics = async (req, res) => {
  try {
    // Get total certificates
    const totalCertificates = await Certificate.countDocuments();

    // Get recent certificates (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCertificates = await Certificate.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get user roles distribution
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const studentUsers = await User.countDocuments({ role: 'user' });

    // Get certificate types distribution
    const bachelorCertificates = await Certificate.countDocuments({ certificateType: 'bachelor' });
    const masterCertificates = await Certificate.countDocuments({ certificateType: 'master' });
    const phdCertificates = await Certificate.countDocuments({ certificateType: 'phd' });
    const professionalCertificates = await Certificate.countDocuments({
      certificateType: 'professional',
    });

    // Get revenue (mock data for now)
    // In a real app, this would come from payment records
    const revenue = totalCertificates * 50; // Assuming $50 per certificate

    res.json({
      success: true,
      data: {
        totalCertificates,
        recentCertificates,
        totalUsers,
        revenue,
        userDistribution: {
          admin: adminUsers,
          student: studentUsers,
        },
        certificateDistribution: {
          bachelor: bachelorCertificates,
          master: masterCertificates,
          phd: phdCertificates,
          professional: professionalCertificates,
        },
      },
    });
  } catch (error) {
    console.error('Admin statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// Get all certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    const total = await Certificate.countDocuments();

    res.json({
      success: true,
      data: certificates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
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
};

// Update a user
exports.updateUser = async (req, res) => {
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
};

// Delete a user
exports.deleteUser = async (req, res) => {
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

    await User.findByIdAndDelete(req.params.id);

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
};

// Update certificate status (issue or revoke)
exports.updateCertificateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'issued', 'revoked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status: pending, issued, or revoked',
      });
    }

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    certificate.status = status;

    // If issuing for the first time, set the issue date
    if (status === 'issued' && certificate.status !== 'issued') {
      certificate.issueDate = new Date();
    }

    await certificate.save();

    res.json({
      success: true,
      message: `Certificate ${status} successfully`,
      data: certificate,
    });
  } catch (error) {
    console.error('Update certificate status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// Delete a certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    await Certificate.findByIdAndDelete(req.params.id);

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
};
