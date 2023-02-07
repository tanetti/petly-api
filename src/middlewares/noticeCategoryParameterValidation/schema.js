const Joi = require('joi');
const PUBLIC_CATEGORIES = require('../../constants/publicCategories');

const noticeCategoryParameterValidationSchema = Joi.string()
  .valid(...PUBLIC_CATEGORIES, 'all')
  .required()
  .messages({
    'string.base': 'notice-category-format-error',
    'any.valid': 'notice-category-format-error',
    'any.required': 'notice-category-required-error',
  });

module.exports = noticeCategoryParameterValidationSchema;
