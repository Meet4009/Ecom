const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');
const {
    createOrder,
    getSingleOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');

// User routes
router.post('/create', authMiddleware, createOrder);
router.get('/me', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getSingleOrder);

// Admin routes
router.get('/admin/orders', authMiddleware, authorizeRoles('admin'), getAllOrders);
router.put('/admin/:id', authMiddleware, authorizeRoles('admin'), updateOrderStatus);

module.exports = router;
