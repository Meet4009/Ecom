const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');

exports.addToCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const quantity = Number(req.body?.quantity) || 1;

        if (!productId) {
            return next(new ErrorHandler("Product ID is required", 400));
        }

        if (quantity < 1) {
            return next(new ErrorHandler("Quantity must be at least 1", 400));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        if (product.stock < quantity) {
            return next(new ErrorHandler(`Only ${product.stock} items available in stock`, 400));
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

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
            message: "Item added to cart successfully",
            cart
        });

    } catch (err) {
        next(new ErrorHandler(`Cart operation failed: ${err.message}`, 500));
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
        return next(new ErrorHandler(err.message, 500));
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 0) {
            return next(new ErrorHandler("Please provide product ID and valid quantity", 400));
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return next(new ErrorHandler("Item not found in cart", 404));
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            const product = await Product.findById(productId);
            if (product.stock < quantity) {
                return next(new ErrorHandler("Not enough stock available", 400));
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
        return next(new ErrorHandler(err.message, 500));
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
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
        return next(new ErrorHandler(err.message, 500));
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });

    } catch (err) {
        return next(new ErrorHandler(err.message, 500));
    }
};
