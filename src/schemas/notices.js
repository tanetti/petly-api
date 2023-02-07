const Joi = require('joi');

const addSchema = Joi.object({
  title: Joi.string().min(2).max(48).required(),
  name: Joi.string().min(2).max(16).required(),
  birthdate: Joi.date().required(),
  breed: Joi.string().min(2).max(24),
  location: Joi.string(),
  comments: Joi.string().min(8).max(500),
  price: Joi.number().min(1).max(99999999),
  category: Joi.string().valid('sell', 'lost-found', 'for-free').required(),
  sex: Joi.string().valid('male', 'female'),
});

module.exports = {
  addSchema,
};
