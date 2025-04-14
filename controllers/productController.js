const Product = require("../models/productModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const { productValidationSchema, productUpdateValidationSchema } = require("../validators/productValidation");
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// ----------  Admin Dashboard ---------- //
exports.adminDashboard = async (req, res, next) => {
    try {
        // User statistics
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const totalUsersToday = await User.countDocuments({ create_At: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });

        // Product statistics
        const totalProducts = await Product.countDocuments();
        const totalActiveProducts = await Product.countDocuments({ status: "active" });
        const totalInactiveProducts = await Product.countDocuments({ status: "inactive" });
        const productsAddedToday = await Product.countDocuments({ 
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        res.status(200).json({
            success: true,
            message: "Admin Dashboard",
            data: {
                users: {
                    totalUsers,
                    totalAdmins,
                    totalUsersToday,
                },
                products: {
                    totalProducts,
                    totalActiveProducts,
                    totalInactiveProducts,
                    productsAddedToday
                }
            },
        });

    } catch (err) {
        next(new ErrorHandler(`Server Error: ${err.message}`, 500));
    }
}


// ---------- Create Product ---------- //
exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, brand, stock, description, faqs } = req.body;

        // Ensure files are uploaded
        if (!req.files?.length) {
            return res.status(400).json({
                success: false,
                message: "Product images are required"
            });
        }

        // Safely parse JSON strings
        let parsedDescription, parsedFaqs;
        try {
            parsedDescription = typeof description === "string" ? JSON.parse(description) : description;
            parsedFaqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON format in description or FAQs"
            });
        }

        // Validate input
        const validationPayload = {
            name, price, category, brand, stock,
            description: parsedDescription,
            faqs: parsedFaqs,
            createdUser: req.user.id
        };

        const { error } = productValidationSchema.validate(validationPayload);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const baseURL = process.env.BASE_URL
        // Map uploaded images
        const productImages = req.files.map(file => ({
            url: `${baseURL}/uploads/products/${file.filename}`,
            public_id: file.filename
        }));

        const newProduct = new Product({
            ...validationPayload,
            productImages
        });

        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct });

    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: err.message
        });
    }
};

// ---------- Get All Products - Admin --------- //
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("createdUser", "name email");
        res.status(200).json({ success: true, products });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

// ---------- Get Single Product --------- //

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("createdUser", "name email");

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// ---------- Update Product --------- //

exports.updateProduct = async (req, res) => {
    try {
        // Create update payload only with fields present in request body
        let updatePayload = {};

        // Handle each field that might be in the request body
        Object.keys(req.body).forEach(key => {
            if (key === 'description' || key === 'faqs') {
                try {
                    updatePayload[key] = typeof req.body[key] === "string"
                        ? JSON.parse(req.body[key])
                        : req.body[key];
                } catch (parseError) {
                    throw new Error(`Invalid JSON format in ${key}`);
                }
            } else {
                updatePayload[key] = req.body[key];
            }
        });

        // Validate only the fields being updated
        const { error } = productUpdateValidationSchema.validate(updatePayload, {
            allowUnknown: true,
            stripUnknown: true,
            presence: 'optional'
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updatePayload },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    }
    catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Server Error",
            error: err.message
        });
    }
}

// ---------- Delete Product --------- //

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Delete all associated images
        for (const image of product.productImages) {
            try {
                const imagePath = path.join(__dirname, '..', image.url);
                await fsPromises.unlink(imagePath);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error("Error deleting image:", error);
                }
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// ---------- Update Product Images --------- //
exports.updateProductImages = async (req, res, next) => {
    try {
        // Basic validation
        if (!req.files || req.files.length === 0) {
            return next(new ErrorHandler("Please upload at least one image", 400));
        }

        // Validate each file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        
        for (const file of req.files) {
            if (file.size > maxSize) {
                // Clean up all uploaded files
                await Promise.all(req.files.map(f => fsPromises.unlink(f.path)));
                return next(new ErrorHandler(`Image ${file.originalname} size should be less than 5MB`, 400));
            }

            if (!allowedTypes.includes(file.mimetype)) {
                await Promise.all(req.files.map(f => fsPromises.unlink(f.path)));
                return next(new ErrorHandler("Please upload only JPG, JPEG or PNG images", 400));
            }
        }

        // Find product
        const product = await Product.findById(req.params.id);
        if (!product) {
            await Promise.all(req.files.map(f => fsPromises.unlink(f.path)));
            return next(new ErrorHandler("Product not found", 404));
        }

        // Delete all existing images
        for (const oldImage of product.productImages) {
            try {
                const imagePath = path.join(__dirname, '..', oldImage.url);
                await fsPromises.unlink(imagePath);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error("Error deleting old image:", error);
                }
            }
        }

        // Prepare new images data
        const newImages = req.files.map(file => ({
            url: `/uploads/products/${file.filename}`,
            public_id: file.filename
        }));

        // Replace old images with new ones
        product.productImages = newImages;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product images updated successfully",
            data: product
        });

    } catch (err) {
        // Clean up uploaded files if error occurs
        if (req.files) {
            await Promise.all(req.files.map(file => 
                fsPromises.unlink(file.path).catch(console.error)
            ));
        }
        next(new ErrorHandler(`Server Error: ${err.message}`, 500));
    }
};

// ---------- Create/Update Product Review ---------- //
exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Please provide a rating between 1 and 5"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if user already reviewed
        const existingReviewIndex = product.reviews.findIndex(
            review => review.user.toString() === req.user._id.toString()
        );

        const review = {
            user: req.user._id,
            rating: Number(rating),
            comment
        };

        if (existingReviewIndex >= 0) {
            // Update existing review
            product.reviews[existingReviewIndex] = review;
        } else {
            // Add new review
            product.reviews.push(review);
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Review added successfully"
        });

    } catch (err) {
        console.error("Error creating review:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create review",
            error: err.message
        });
    }
};

// ---------- Get Product Reviews ---------- //
exports.getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: 'reviews.user',
                select: 'name profileImage'
            });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews
        });

    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: err.message
        });
    }
};

// ---------- Delete Review ---------- //
exports.deleteReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Filter out the review
        product.reviews = product.reviews.filter(
            review => review.user.toString() !== req.user._id.toString()
        );

        await product.save();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: err.message
        });
    }
};



