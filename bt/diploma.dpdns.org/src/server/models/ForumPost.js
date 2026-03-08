const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['general', 'support', 'news', 'discussion'],
    default: 'general',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      name: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
forumPostSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for faster queries
forumPostSchema.index({ author: 1 });
forumPostSchema.index({ category: 1 });
forumPostSchema.index({ createdAt: -1 });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost;
