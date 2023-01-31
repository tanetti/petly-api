const Joi = require('joi');

const addSchema = Joi.object({
  title: Joi.string().min(2).max(48).required(),
  name: Joi.string().min(2).max(16).required(),
  birthdate: Joi.date().messages({ valid: 'format MM-DD-YYYY' }),
  breed: Joi.string().min(2).max(24),
  location: Joi.string(),
  comments: Joi.string()
    .regex(/^[,. a-z0-9]+$/)
    .min(8)
    .max(120)
    .required(),
  price: Joi.number().min(1),
  favorite: Joi.boolean(),
  category: Joi.string().valid('sell', 'lost-found', 'for-free').required(),
  sex: Joi.string().valid('male', 'female'),
  petsAvatarURL: Joi.string().required(),
});

// const updateStatusNoticeSchema = Joi.object({
//   favorite: Joi.boolean().required(),
// });

module.exports = {
  addSchema,
  // updateStatusNoticeSchema,
};
