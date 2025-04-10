const Joi = require("joi");

// Register Validation Function
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        password: Joi.string().min(4).max(255).required(),
        profileImage: Joi.string().optional(), // Optional, can be empty string
        role: Joi.string().valid("user", "admin").optional(), // Optional, can be empty string
    });
    return schema.validate(data);
};


// Login Validation Function
const loginValidation = (data) => {
    const schema = Joi.object({
        login: Joi.string().required(), // Can be email or phone number
        password: Joi.string().min(4).required(),
    });
    return schema.validate(data);
};

// Validate profile update
const profileUpdateValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(4),
        email: Joi.string().min(6).email(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/),
        profileImage: Joi.string().optional(), // Optional, can be empty string
    });
    return schema.validate(data);
};

// Validate password reset
const updatePasswordValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(4).required(),
        newPassword: Joi.string().min(4).required(),
        confirmPassword: Joi.string().required(),
    });
    return schema.validate(data);
};

const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });
    return schema.validate(data);
};

// Validate password reset token


const resetPasswordTokenValidation = (data) => {
    const schema = Joi.object({
        newPassword: Joi.string().min(4).required(),
        confirmPassword: Joi.string().min(4).required(),
    });
    return schema.validate(data);
};


module.exports = { registerValidation, loginValidation, profileUpdateValidation, updatePasswordValidation, forgotPasswordValidation, resetPasswordTokenValidation };