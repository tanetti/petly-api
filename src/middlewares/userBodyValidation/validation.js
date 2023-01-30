const {
  registerUserBodyValidationSchema,
  loginUserBodyValidationSchema,
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

  if (error) {
    const [firstError] = error.details;

    return res
      .status(400)
      .json({ code: 'api-validation-error', message: firstError.message });
  }

  next();
};

module.exports = userBodyValidation;
