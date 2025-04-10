const Joi = require("joi");

const productValidationSchema = Joi.object({

  name: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  stock: Joi.number().integer().required(),
  createdUser: Joi.string().required(),

  // Arrays of objects
  description: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      points: Joi.array().items(Joi.string().required()).required()
    })
  ).required(),

  faqs: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      answer: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          points: Joi.array().items(Joi.string().required()).required()
        })
      ).required()
    })
  ).required()
});

module.exports = productValidationSchema;
