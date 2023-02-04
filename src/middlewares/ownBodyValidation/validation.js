const ownBodyValidationSchema = require('./schema');

const ownBodyValidation = (req, res, next) => {
  const error = ownBodyValidationSchema.validate(req.body).error;

  if (error) {
    const [firstError] = error.details;

    return res.status(400).json({ code: firstError.message });
  }

  next();
};

module.exports = ownBodyValidation;
