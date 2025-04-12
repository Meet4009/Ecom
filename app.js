const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// Route Imports
const userRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const errorMiddleware = require("./middlewares/error");

// Middleware.
app.use(express.json()); // for parsing JSON
app.use(express.urlencoded({ extended: true })); // for parsing form data
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;