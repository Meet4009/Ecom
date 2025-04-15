const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

// Ensure a user can't add the same product twice
watchlistSchema.index({ user: 1, 'products': 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
