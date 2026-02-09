const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  course: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  tags: [String],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  isSaved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  location: {
    type: String,
    default: null
  },
  filters: {
    type: String,
    default: 'none'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
