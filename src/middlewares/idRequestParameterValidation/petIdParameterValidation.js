const idRequestParameterValidationSchema = require('./schema');

const petIdQueryParameterValidation = (req, res, next) => {
  const { petId } = req.params;

  const error = idRequestParameterValidationSchema.validate(petId).error;

  if (error) {
    const [firstError] = error.details;

    return res
      .status(400)
      .json({ code: 'validation-error', message: firstError.message });
  }

  next();
};

module.exports = petIdQueryParameterValidation;
