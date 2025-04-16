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
    totalQuantity: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add method to calculate totals
cartSchema.methods.calculateTotals = function() {
    this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.total = this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

// Combined pre-save middleware with error handling
cartSchema.pre('save', async function(next) {
    try {
        if (this.isModified('items')) {
            await this.populate('items.product', 'price');
            
            // Validate all products exist
            const invalidItems = this.items.filter(item => !item.product);
            if (invalidItems.length > 0) {
                throw new Error('One or more products not found');
            }

            this.calculateTotals();
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Add validation middleware
cartSchema.pre('validate', function(next) {
    if (this.items.length > 20) {
        next(new Error('Cart cannot have more than 20 items'));
        return;
    }
    next();
});

// Add index for better performance
cartSchema.index({ user: 1, 'items.product': 1 });

module.exports = mongoose.model('Cart', cartSchema);
