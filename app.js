const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// Route Imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const errorMiddleware = require("./middlewares/error");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Middleware.
app.use(express.json()); // for parsing JSON
app.use(express.urlencoded({ extended: true })); // for parsing form data
app.use(cookieParser());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "http://localhost:5173", process.env.FRONT_END_URL], // Adjust for prod
        },
    },
}));
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: false
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// Error Middleware
app.use(errorMiddleware);

// Global error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    res.status(err.statusCode).json({
        success: false,
        error: {
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

module.exports = app;