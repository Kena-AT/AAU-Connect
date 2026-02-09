const express = require('express');
const { 
  signup, 
  login, 
  getMe, 
  logout 
} = require('../controllers/auth.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
