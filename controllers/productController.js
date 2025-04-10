const Product = require("../models/productModel");
const productValidationSchema = require("../validators/productValidation");

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

        // Map uploaded images
        const productImages = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
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
        const { name, price, category, brand, stock, description, faqs } = req.body;
        
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
            faqs: parsedFaqs
        };

        const { error } = productValidationSchema.validate(validationPayload);
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.details[0].message 
            });
        }
        
        const product = await Product.findByIdAndUpdate(req.params.id, validationPayload, { new: true });
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        res.status(200).json({ success: true, product });
    }
    catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// ---------- Delete Product --------- //

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}

// ---------- Update Product Images --------- //
exports.updateProductImages = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        // Map uploaded images
        const images = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            public_id: file.filename
        }));
        
        product.images.push(...images);
        
        await product.save();
        
        res.status(200).json({ success: true, product });
    } catch (err) {
        console.error("Error updating product images:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}



