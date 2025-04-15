const Joi = require("joi");

const orderValidationSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().min(1).required()
        })
    ).required(),
    shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pinCode: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
    }).required(),
    paymentInfo: Joi.object({
        id: Joi.string(),
        status: Joi.string(),
        type: Joi.string()
    })
});

module.exports = { orderValidationSchema };
