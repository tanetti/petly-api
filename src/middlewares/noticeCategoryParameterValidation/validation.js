const noticeCategoryParameterValidationSchema = require('./schema');

const noticeCategoryParameterValidation = (req, res, next) => {
  const { categoryName } = req.params;

  const error =
    noticeCategoryParameterValidationSchema.validate(categoryName).error;

  if (error) {
    const [firstError] = error.details;

    return res
      .status(400)
      .json({ code: 'validation-error', message: firstError.message });
  }

  next();
};

module.exports = noticeCategoryParameterValidation;
