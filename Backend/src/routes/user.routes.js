const express = require('express');
const router = express.Router();
const { toggleFollow, getRecommendedFriends } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All routes are protected

router.post('/:id/follow', toggleFollow);
router.get('/recommended', getRecommendedFriends);

module.exports = router;
