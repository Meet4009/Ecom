const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // MongoDB Invalid ObjectID Error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}: ${err.value}`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate ${field} entered. Please choose another value.`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT error
    if (err.name === 'JsonWebTokenError') {
        err = new ErrorHandler('Invalid token. Please log in again.', 401);
    }

    // JWT Token expired error
    if (err.name === 'TokenExpiredError') {
        err = new ErrorHandler('Token expired. Please log in again.', 401);
    }

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        err = new ErrorHandler('File size is too large. Maximum size is 5MB.', 400);
    }

    res.status(err.statusCode).json({
        success: false,
        error: {
            message: err.message,
            code: err.statusCode,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};
