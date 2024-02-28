const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/utils/appError');
const {
  getRooms,
  deleteRoom: deleteRoomApi,
  createEditRoom: createEditRoomApi,
} = require('../src/services/apiRoom');

exports.getAllRooms = catchAsync(async (req, res, next) => {
  // To allow for nested GET Reviews on tour (hack)
  let filter = {};
  // if (req.params.tourid) {
  //   filter = { tour: req.params.tourid };
  // }

  // EXECUTE QUERY
  const { data: rooms, error } = await getRooms(req);

  if (error) {
    console.error(error);
    // return next(new AppError('Rooms data could not be loaded', 400));
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: rooms.length,
    data: { rooms },
    error,
  });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new AppError('Missing room id', 400));
  }

  const { data: room, error } = await deleteRoomApi(id);

  if (error) {
    console.error(error);
    return next(new AppError('Room data could not be deleted'));
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: room,
  });
});

exports.createEditRoom = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const newRoom = req.body;

  const { data: room, error } = await createEditRoomApi({ newRoom, id });

  if (error) {
    console.error(error);
    return next(new AppError('Room could not be created or edited'));
  }

  // SEND RESPONSE
  res.status(201).json({
    status: 'success',
    data: room,
  });
});
