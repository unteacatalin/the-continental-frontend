const express = require('express');

const { signIn, signOut } = require('../controllers/authController');

const router = express.Router();

router.post('/signin', signIn);
router.get('/signout', signOut);

module.exports = router;
