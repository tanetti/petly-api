const idRequestParameterValidationSchema = require('./schema');

const ownIdQueryParameterValidation = (req, res, next) => {
  const { ownId } = req.params;

  const error = idRequestParameterValidationSchema.validate(ownId).error;

  if (error) {
    const [firstError] = error.details;

    return res
      .status(400)
      .json({ code: 'validation-error', message: firstError.message });
  }

  next();
};

module.exports = ownIdQueryParameterValidation;
