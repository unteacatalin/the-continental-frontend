const express = require('express');

const { getAllRooms } = require('../controllers/roomController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.route('/').get(protect, getAllRooms);
//   .post(protect, restrictTo('admin', 'lead-guide'), createTour);

module.exports = router;
