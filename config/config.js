const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_TIME: process.env.JWT_EXPIRES_TIME || '1h',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SERVICE: process.env.SMTP_SERVICE,
    SMTP_MAIL: process.env.SMTP_MAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD
};
