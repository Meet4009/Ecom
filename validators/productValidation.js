const Joi = require("joi");

// Common sub-schemas
const pointsSchema = {
  title: Joi.string().required(),
  points: Joi.array().items(Joi.string().required()).required()
};

const baseProductSchema = {
  name: Joi.string(),
  price: Joi.number(),
  category: Joi.string(),
  brand: Joi.string(),
  stock: Joi.number().integer(),
  createdUser: Joi.string(),
  description: Joi.array().items(Joi.object(pointsSchema)),
  faqs: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      answer: Joi.array().items(Joi.object(pointsSchema)).required()
    })
  )
};

// Create schema makes all fields required
const productValidationSchema = Joi.object({ 
  ...baseProductSchema
}).required().options({ presence: 'required' });

// Update schema makes all fields optional but requires at least one
const productUpdateValidationSchema = Joi.object({
  ...baseProductSchema
}).min(1);

module.exports = {
  productValidationSchema,
  productUpdateValidationSchema
};
