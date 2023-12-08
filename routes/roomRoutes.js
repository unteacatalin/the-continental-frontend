const express = require('express');

const { getAllRooms } = require('../controllers/roomController');

const router = express.Router();

router.route('/').get(getAllRooms);
//   .post(protect, restrictTo('admin', 'lead-guide'), createTour);

module.exports = router;
