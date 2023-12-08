const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const supabase = require('./../utils/supabase');

exports.getAllRooms = catchAsync(async (req, res, next) => {
  // To allow for nested GET Reviews on tour (hack)
  let filter = {};
  // if (req.params.tourid) {
  //   filter = { tour: req.params.tourid };
  // }

  // EXECUTE QUERY
  let { data: rooms, error } = await supabase.from('rooms').select('*');

  if (error) {
    console.error(error);
    next(new AppError('Rooms data could not be loaded', 400));
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: rooms.length,
    data: { rooms },
  });
});
