const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1']
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Pre-save middleware to calculate total
cartSchema.pre('save', async function(next) {
    const populated = await this.populate('items.product', 'price');
    this.total = populated.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
