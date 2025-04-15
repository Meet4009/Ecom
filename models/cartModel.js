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
    totalQuantity:{
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Pre-save middleware to calculate totalPrice
cartSchema.pre('save', async function(next) {
    const populated = await this.populate('items.product', 'price');
    this.total = populated.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);
    next();
});
// Pre-save middleware to calculate totalQuantity
cartSchema.pre('save', function(next) {
    this.totalQuantity = this.items.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);
    next();
});
module.exports = mongoose.model('Cart', cartSchema);
