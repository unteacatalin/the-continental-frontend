const express = require('express');

const {
  signIn,
  signOut,
  signUp,
  protect,
  updatePassword,
  getMe,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe);
router.patch('/updateMyPassword', updatePassword);

module.exports = router;
