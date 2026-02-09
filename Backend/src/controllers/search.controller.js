const User = require('../models/user.model');
const Post = require('../models/post.model');

// @desc    Global search across multiple entities
// @route   GET /api/search
// @access  Private
exports.searchAll = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const searchResults = [];

    // Search Users
    if (!type || type === 'all' || type === 'people') {
      const users = await User.find({
        $or: [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } },
          { department: { $regex: q, $options: 'i' } }
        ]
      }).limit(5);

      users.forEach(user => {
        searchResults.push({
          id: user._id,
          type: 'people',
          title: `${user.firstName} ${user.lastName}`,
          description: user.department,
          color: user.gradient || '#6366f1'
        });
      });
    }

    // Search Posts
    if (!type || type === 'all' || type === 'posts') {
      const posts = await Post.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }).limit(5);

      posts.forEach(post => {
        searchResults.push({
          id: post._id,
          type: 'posts',
          title: post.title,
          description: post.description.substring(0, 50) + '...',
          color: '#ec4899'
        });
      });
    }

    // Placeholder for Groups and Events until models are added
    if (type === 'groups' || type === 'events') {
       // Currently no models, return empty or mock if needed
    }

    res.status(200).json({
      success: true,
      data: searchResults
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
