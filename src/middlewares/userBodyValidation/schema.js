/* eslint-disable prefer-regex-literals */
const joi = require('joi');

const registerUserBodyValidationSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.base': "User's Email must be a string",
    'string.email': "Incorrect format of user's Email",
    'any.required': "User's Email was not specified",
  }),

  password: joi.string().min(8).required().messages({
    'string.base': "User's Password must be a string",
    'string.min': "User's Password must contain 8 or above symbols",
    'any.required': "User's Password was not specified",
  }),

  name: joi.string().messages({
    'string.base': "User's Name must be a string",
  }),

  address: joi.string().messages({
    'string.base': "User's Address must be a string",
  }),

  phone: joi.string().messages({
    'string.base': "User's Phone number must be a string",
  }),
});

const loginUserBodyValidationSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.base': "User's Email must be a string",
    'string.email': "Incorrect format of user's Email",
    'any.required': "User's Email was not specified",
  }),

  password: joi.string().min(8).required().messages({
    'string.base': "User's Password must be a string",
    'string.min': "User's Password must contain 8 or above symbols",
    'any.required': "User's Password was not specified",
  }),
});

module.exports = {
  registerUserBodyValidationSchema,
  loginUserBodyValidationSchema,
};
