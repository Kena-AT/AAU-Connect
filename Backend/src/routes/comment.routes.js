const express = require('express');
const {
  getComments,
  addComment
} = require('../controllers/comment.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect); // Protect all comment routes

router.route('/:postId')
  .get(getComments)
  .post(addComment);

module.exports = router;
