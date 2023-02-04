/* eslint-disable prefer-regex-literals */
const joi = require('joi');

const ownBodyValidationSchema = joi.object({
  name: joi.string().required().messages({
    'string.base': 'own-name-format-error',
    'any.required': 'own-name-required-error',
  }),

  birthdate: joi.date().required().messages({
    'date.base': 'own-birthdate-format-error',
    'any.required': 'own-birthdate-required-error',
  }),

  breed: joi.string().required().messages({
    'string.base': 'own-breed-format-error',
    'any.required': 'own-breed-required-error',
  }),

  comments: joi.string().messages({
    'string.base': 'own-comments-format-error',
  }),
});

module.exports = ownBodyValidationSchema;
