/* eslint-disable prefer-regex-literals */
const joi = require('joi');

const idRequestParameterValidationSchema = joi
  .string()
  .pattern(new RegExp('^[a-z0-9]+$'))
  .length(24)
  .required()
  .messages({
    'string.pattern.base': 'request-parameter-format-error',
    'string.length': 'request-parameter-length-error',
    'any.required': 'request-parameter-required-error',
  });

module.exports = idRequestParameterValidationSchema;
