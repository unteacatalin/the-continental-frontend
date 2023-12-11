const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const supabase = require('./../utils/supabase');

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const userData = await login({ email, password });

  if (!userData) {
    next(new AppError('User not found', 400));
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: { user: userData },
  });
});
