/* eslint-disable prefer-regex-literals */
const joi = require('joi');

const ownBodyValidationSchema = joi.object({
  name: joi.string().min(2).max(30).required().messages({
    'string.base': 'own-name-format-error',
    'string.min': 'own-name-length-error',
    'string.max': 'own-name-length-error',
    'any.required': 'own-name-required-error',
  }),

  birthdate: joi.date().required().messages({
    'date.base': 'own-birthdate-format-error',
    'any.required': 'own-birthdate-required-error',
  }),

  breed: joi.string().min(2).max(30).required().messages({
    'string.base': 'own-breed-format-error',
    'string.min': 'own-breed-length-error',
    'string.max': 'own-breed-length-error',
    'any.required': 'own-breed-required-error',
  }),

  comments: joi.string().max(500).messages({
    'string.base': 'own-comments-format-error',
    'string.max': 'own-comments-length-error',
  }),
});

module.exports = ownBodyValidationSchema;
