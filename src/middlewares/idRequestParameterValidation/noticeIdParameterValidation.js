const idRequestParameterValidationSchema = require('./schema');

const ownIdQueryParameterValidation = (req, res, next) => {
  const { noticeId } = req.params;

  const error = idRequestParameterValidationSchema.validate(noticeId).error;

  if (error) {
    const [firstError] = error.details;

    return res
      .status(400)
      .json({ code: 'validation-error', message: firstError.message });
  }

  next();
};

module.exports = ownIdQueryParameterValidation;
