const noticeBodyValidationSchema = require('./schema');

const noticeBodyValidation = (req, res, next) => {
  const error = noticeBodyValidationSchema.validate(req.body).error;

  if (error) {
    const [firstError] = error.details;

    return res.status(400).json({ code: firstError.message });
  }

  next();
};

module.exports = noticeBodyValidation;
