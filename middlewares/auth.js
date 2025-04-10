const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Middleware to authenticate user using JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.authMiddleware = async (req, res, next) => {
    let token;

    // Get the token from header.authorization -> Bearer Token or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt; // Check in cookies if not in header
    } else {
        return res.status(401).json({ 
            success: false,
            message: 'No token provided, authorization denied' 
        });
    }

    try {
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodeData.id);
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found or token invalid' 
            });
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false,
            message: 'Not authorized, authentication failed' 
        });
    }
};

/**
 * Middleware to authorize user roles
 * @param {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: `Role (${req.user?.role || 'none'}) is not authorized to access this route` 
            });
        }
        next();
    };
};
