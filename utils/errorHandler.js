/**
 * Custom error handler class for API errors
 * @extends Error
 */
class ErrorHandler extends Error {
    /**
     * Creates an instance of ErrorHandler
     * @param {string} message - Error message
     * @param {number} [statusCode=500] - HTTP status code
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        this.timestamp = new Date().toISOString();
        
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Creates a bad request error
     * @param {string} message - Error message
     * @returns {ErrorHandler} Instance of ErrorHandler
     */
    static badRequest(message) {
        return new ErrorHandler(message, 400);
    }

    /**
     * Creates an unauthorized error
     * @param {string} [message='Unauthorized access'] - Error message
     * @returns {ErrorHandler} Instance of ErrorHandler
     */
    static unauthorized(message = 'Unauthorized access') {
        return new ErrorHandler(message, 401);
    }

    /**
     * Creates a forbidden error
     * @param {string} [message='Forbidden access'] - Error message
     * @returns {ErrorHandler} Instance of ErrorHandler
     */
    static forbidden(message = 'Forbidden access') {
        return new ErrorHandler(message, 403);
    }

    /**
     * Creates a not found error
     * @param {string} [message='Resource not found'] - Error message
     * @returns {ErrorHandler} Instance of ErrorHandler
     */
    static notFound(message = 'Resource not found') {
        return new ErrorHandler(message, 404);
    }

    /**
     * Creates a server error
     * @param {string} [message='Internal server error'] - Error message
     * @returns {ErrorHandler} Instance of ErrorHandler
     */
    static serverError(message = 'Internal server error') {
        return new ErrorHandler(message, 500);
    }

    /**
     * Converts the error object to JSON format
     * @returns {Object} JSON representation of the error
     */
    toJSON() {
        return {
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            timestamp: this.timestamp,
            ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
        };
    }
}

module.exports = ErrorHandler;
