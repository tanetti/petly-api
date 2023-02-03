const {
  registerUserBodyValidationSchema,
  loginUserBodyValidationSchema,
  updateUserBodyValidationSchema,
} = require('./schema');

const userBodyValidation = (req, res, next) => {
  const requestMethod = req.method;
  const requestPath = req.path;

  let error = null;

  if (requestMethod === 'POST' && requestPath === '/register') {
    error = registerUserBodyValidationSchema.validate(req.body).error;
  }

  if (requestMethod === 'POST' && requestPath === '/login') {
    error = loginUserBodyValidationSchema.validate(req.body).error;
  }

  if (requestMethod === 'PATCH' && requestPath === '/current') {
    error = updateUserBodyValidationSchema.validate(req.body).error;
  }

  if (error) {
    const [firstError] = error.details;

    return res.status(400).json({ code: firstError.message });
  }

  next();
};

module.exports = userBodyValidation;
