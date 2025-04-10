const mongoose = require('mongoose');
const config = require('../config/config');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(config.MONGODB_URI);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('Please check your MONGODB_URI in .env file');
        process.exit(1);
    }
};

module.exports = connectDB;