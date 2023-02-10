const petBodyValidationSchema = require('./schema');

const petBodyValidation = (req, res, next) => {
  const error = petBodyValidationSchema.validate(req.body).error;

  if (error) {
    const [firstError] = error.details;

    return res.status(400).json({ code: firstError.message });
  }

  next();
};

module.exports = petBodyValidation;
