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
        if (typeof message !== 'string') {
            message = String(message);
        }
        super(message);
        this.statusCode = Number(statusCode) || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;
