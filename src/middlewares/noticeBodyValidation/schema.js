const Joi = require('joi');
const PUBLIC_CATEGORIES = require('../../constants/publicCategories');

const noticeBodyValidationSchema = Joi.object({
  title: Joi.string().min(2).max(60).required().messages({
    'string.base': 'notice-title-format-error',
    'string.min': 'notice-title-length-error',
    'string.max': 'notice-title-length-error',
    'any.required': 'notice-title-required-error',
  }),

  name: Joi.string().min(2).max(30).required().messages({
    'string.base': 'notice-name-format-error',
    'string.min': 'notice-name-length-error',
    'string.max': 'notice-name-length-error',
    'any.required': 'notice-name-required-error',
  }),

  birthdate: Joi.date().required().messages({
    'date.base': 'notice-birthdate-format-error',
    'any.required': 'notice-birthdate-required-error',
  }),

  breed: Joi.string().min(2).max(30).required().messages({
    'string.base': 'notice-breed-format-error',
    'string.min': 'notice-breed-length-error',
    'string.max': 'notice-breed-length-error',
    'any.required': 'notice-breed-required-error',
  }),

  location: Joi.string().required().messages({
    'string.base': 'notice-location-format-error',
    'any.required': 'notice-location-required-error',
  }),

  comments: Joi.string().max(500).messages({
    'string.base': 'notice-comments-format-error',
    'string.max': 'notice-comments-length-error',
  }),

  price: Joi.number().min(1).max(99999999).messages({
    'number.base': 'notice-price-format-error',
    'number.min': 'notice-price-length-error',
    'number.max': 'notice-price-length-error',
    'any.required': 'notice-price-required-error',
  }),

  category: Joi.string()
    .valid(...PUBLIC_CATEGORIES)
    .required()
    .messages({
      'string.base': 'notice-category-format-error',
      'any.valid': 'notice-category-format-error',
      'any.required': 'notice-category-required-error',
    }),

  sex: Joi.string().valid('male', 'female').required().messages({
    'string.base': 'notice-sex-format-error',
    'any.valid': 'notice-sex-format-error',
    'any.required': 'notice-sex-required-error',
  }),
});

module.exports = noticeBodyValidationSchema;
