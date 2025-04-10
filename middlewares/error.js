const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    // Set default error values
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Handle specific MongoDB and JWT errors
    const errorTypes = {
        CastError: { message: `Resource not found. Invalid: ${err.path}`, code: 400 },
        JsonWebTokenError: { message: "Invalid JSON Web Token, please try again", code: 401 },
        TokenExpiredError: { message: "JSON Web Token has expired, please login again", code: 401 },
        ValidationError: { message: err.message, code: 400 },
        MongoServerError: { message: err.code === 11000 ? 
            `Duplicate ${Object.keys(err.keyValue)} entered` : 
            "Database error occurred", 
            code: 400 
        }
    };

    // Apply specific error handling if error type is recognized
    if (errorTypes[err.name]) {
        const { message, code } = errorTypes[err.name];
        err = new ErrorHandler(message, code);
    }

    // Send error response
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
