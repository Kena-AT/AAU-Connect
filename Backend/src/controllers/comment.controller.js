const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

// @desc    Get comments for a specific post
// @route   GET /api/comments/:postId
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'firstName lastName initials gradient avatarUrl')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const postExists = await Post.findById(req.params.postId);
    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user.id,
      text: req.body.text
    });

    const populatedComment = await comment.populate('author', 'firstName lastName initials gradient avatarUrl');

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
