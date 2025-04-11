const Joi = require("joi");

// Common validation schemas
const passwordSchema = Joi.string().min(4).max(12).required();
const emailSchema = Joi.string().email().required();
const phoneSchema = Joi.string().length(10).pattern(/^[0-9]+$/);

// Reusable password confirmation schema
const passwordConfirmationSchema = {
    newPassword: passwordSchema,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
        .messages({ 'any.only': 'Passwords do not match' })
};

// Common profile fields schema
const profileFieldsSchema = {
    name: Joi.string().min(3).max(50),
    email: emailSchema.optional(),
    phone: phoneSchema.optional()
};

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: emailSchema,
        phone: phoneSchema.required(),
        password: passwordSchema,
        role: Joi.string().valid("user", "admin").optional(),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        login: Joi.string().required(),
        password: passwordSchema,
    });
    return schema.validate(data);
};

const profileUpdateValidation = (data) => {
    const schema = Joi.object({
        ...profileFieldsSchema,
    });
    return schema.validate(data);
};

const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        email: emailSchema
    });
    return schema.validate(data);
};

const resetPasswordTokenValidation = (data) => {
    const schema = Joi.object(passwordConfirmationSchema);
    return schema.validate(data);
};

const updatePasswordValidation = (data) => {
    const schema = Joi.object({
        password: passwordSchema,
        ...passwordConfirmationSchema
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    forgotPasswordValidation,
    resetPasswordTokenValidation,
    updatePasswordValidation
};