const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const cartController = require('../controllers/cartController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/:id', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.put('/update', authMiddleware, cartController.updateCartItem);
router.delete('/remove/:productId', authMiddleware, cartController.removeFromCart);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;
