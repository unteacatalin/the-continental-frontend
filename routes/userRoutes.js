const express = requie('express');

const { signIn } = require('../controllers/authController');

const router = express.Router();

router.post('/signin', signIn);

module.exports = router;
