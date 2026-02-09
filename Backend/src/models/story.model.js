const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add story content (URL or gradient)']
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // 24 hours from now
    index: { expires: 0 } // Create TTL index
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);
