const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "image URL" field must be filled in',
      "string.uri": 'the "image URL" field must be a valid url',
    }),
    weather: Joi.valid("hot", "warm", "cold").required().messages({
      "any.only": "Please select a weather type",
    }),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar URL" field must be filled in',
      "string.uri": 'the "avatar URL" field must be a valid url',
    }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateEditUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar URL" field must be filled in',
      "string.uri": 'the "avatar URL" field must be a valid url',
    }),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUserIDFormat = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

const validateItemIDFormat = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validateCreateItem,
  validateCreateUser,
  validateEditUser,
  validateUserLogin,
  validateUserIDFormat,
  validateItemIDFormat,
};
