const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientName: {
      type: String,
      required: false,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    certificateType: {
      type: String,
      required: true,
      enum: ['bachelor', 'master', 'phd', 'professional'],
    },
    program: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: function () {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 5); // Default 5 year validity
        return date;
      },
    },
    status: {
      type: String,
      enum: ['pending', 'issued', 'revoked'],
      default: 'pending',
    },
    verificationLink: {
      type: String,
    },
    blockchainHash: {
      type: String,
      default: function () {
        // Generate a mock blockchain hash
        return 'SIU' + Date.now().toString(16) + Math.random().toString(16).substring(2, 8);
      },
    },
    metadata: {
      graduationDate: Date,
      gpa: Number,
      honors: String,
      additionalInfo: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate unique certificate number before saving
CertificateSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    // 获取用户名
    if (this.userId) {
      const User = mongoose.model('User');
      const user = await User.findById(this.userId);
      if (user) {
        this.recipientName = user.name;
      }
    }

    // 只有在没有证书编号的情况下才生成新的
    if (!this.certificateNumber) {
      // Generate a unique certificate number
      const currentYear = new Date().getFullYear();
      const prefix = this.certificateType.substring(0, 2).toUpperCase();
      const randomNum = Math.floor(100000 + Math.random() * 900000);

      this.certificateNumber = `SIU-${prefix}-${currentYear}-${randomNum}`;
    }

    // Generate verification link
    this.verificationLink = `/verify/${this.certificateNumber}`;

    next();
  } catch (error) {
    console.error('Error in certificate pre-save hook:', error);
    next(error);
  }
});

// Index for faster queries
CertificateSchema.index({ certificateNumber: 1 });
CertificateSchema.index({ userId: 1 });
CertificateSchema.index({ status: 1 });

module.exports = mongoose.model('Certificate', CertificateSchema);
