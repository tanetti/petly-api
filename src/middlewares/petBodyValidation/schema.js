/* eslint-disable prefer-regex-literals */
const joi = require('joi');

const petBodyValidationSchema = joi.object({
  name: joi.string().min(2).max(30).required().messages({
    'string.base': 'pet-name-format-error',
    'string.min': 'pet-name-length-error',
    'string.max': 'pet-name-length-error',
    'any.required': 'pet-name-required-error',
  }),

  birthdate: joi.date().required().messages({
    'date.base': 'pet-birthdate-format-error',
    'any.required': 'pet-birthdate-required-error',
  }),

  breed: joi.string().min(2).max(30).required().messages({
    'string.base': 'pet-breed-format-error',
    'string.min': 'pet-breed-length-error',
    'string.max': 'pet-breed-length-error',
    'any.required': 'pet-breed-required-error',
  }),

  comments: joi.string().max(500).messages({
    'string.base': 'pet-comments-format-error',
    'string.max': 'pet-comments-length-error',
  }),
});

module.exports = petBodyValidationSchema;
