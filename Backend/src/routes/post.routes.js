const express = require('express');
const {
  getPosts,
  createPost,
  toggleLike,
  toggleSave,
  deletePost,
  reportPost
} = require('../controllers/post.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect); // Protect all post routes

router.route('/')
  .get(getPosts)
  .post(createPost);

router.route('/:id')
  .delete(deletePost);

router.post('/:id/like', toggleLike);
router.post('/:id/save', toggleSave);
router.post('/:id/report', reportPost);

module.exports = router;
