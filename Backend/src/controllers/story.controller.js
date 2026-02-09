const Story = require('../models/story.model');

// @desc    Get all active stories
// @route   GET /api/stories
// @access  Private
exports.getStories = async (req, res) => {
  try {
    // MongoDB TTL index handles deletion, we just fetch all
    const stories = await Story.find()
      .populate('author', 'firstName lastName initials gradient avatarUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
exports.createStory = async (req, res) => {
  try {
    console.log('Incoming Story Data:', req.body);
    const story = await Story.create({
      author: req.user.id,
      content: req.body.content
    });
    console.log('Story created successfully:', story._id);

    const populatedStory = await story.populate('author', 'firstName lastName initials gradient avatarUrl');

    res.status(201).json({
      success: true,
      data: populatedStory
    });
  } catch (err) {
    console.error('Story creation error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
