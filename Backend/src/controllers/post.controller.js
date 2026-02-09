const Post = require('../models/post.model');

// @desc    Get all posts (Feed)
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'firstName lastName firstName initials gradient avatarUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    console.log('Incoming Post Data:', req.body);
    req.body.author = req.user.id;

    const post = await Post.create(req.body);
    console.log('Post created successfully:', post._id);

    const populatedPost = await post.populate('author', 'firstName lastName initials gradient avatarUrl');

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (err) {
    console.error('Post creation error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Toggle Like on a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already liked it
    const index = post.likes.findIndex(id => id.toString() === req.user.id);

    if (index === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: post.likes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Toggle Save/Bookmark on a post
// @route   POST /api/posts/:id/save
// @access  Private
exports.toggleSave = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const index = post.isSaved.findIndex(id => id.toString() === req.user.id);

    if (index === -1) {
      post.isSaved.push(req.user.id);
    } else {
      post.isSaved.splice(index, 1);
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: post.isSaved
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Owner only)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Report a post
// @route   POST /api/posts/:id/report
// @access  Private
exports.reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Placeholder: In a real app, we'd save this to a Reports collection
    console.log(`Post ${post._id} reported by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: 'Post reported'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
