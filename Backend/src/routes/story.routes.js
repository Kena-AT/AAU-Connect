const express = require('express');
const {
  getStories,
  createStory
} = require('../controllers/story.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect); // Protect all story routes

router.route('/')
  .get(getStories)
  .post(createStory);

module.exports = router;
