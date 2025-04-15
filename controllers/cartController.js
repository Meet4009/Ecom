const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');

exports.addToCart = async (req, res, next) => {
    try {
        const productId = req.params.id;  // Changed from destructuring
        const quantity = req.body?.quantity || 1;

        if (!productId || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Please provide product ID and quantity should be at least 1"
            });
        }

        // Check product exists and has enough stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available"
            });
        }

        // Find or create cart for user
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item =>
            item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate('items.product', 'name price productImages');

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart
        });

    } catch (err) {
        next(new ErrorHandler(err.message, 500));
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price productImages');

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: { items: [], total: 0 }
            });
        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (err) {
        next(new ErrorHandler(err.message, 500));
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide product ID and valid quantity"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            const product = await Product.findById(productId);
            if (product.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock available"
                });
            }
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product', 'name price productImages');

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });

    } catch (err) {
        next(new ErrorHandler(err.message, 500));
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(item =>
            item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.product', 'name price productImages');

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart
        });

    } catch (err) {
        next(new ErrorHandler(err.message, 500));
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });

    } catch (err) {
        next(new ErrorHandler(err.message, 500));
    }
};
