const User = require('../models/user.model');

// @desc    Toggle follow/unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
exports.toggleFollow = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (targetUser.id === currentUser.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const isFollowing = currentUser.following.includes(targetUser.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUser.id);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser.id);
    } else {
      // Follow
      currentUser.following.push(targetUser.id);
      targetUser.followers.push(currentUser.id);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing,
      followingCount: currentUser.following.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get recommended friends (same department, not followed)
// @route   GET /api/users/recommended
// @access  Private
exports.getRecommendedFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Find users in same department, excluding self and already followed users
    const recommended = await User.find({
      department: user.department,
      _id: { $ne: user.id, $nin: user.following }
    }).limit(10);

    res.status(200).json({
      success: true,
      data: recommended
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
