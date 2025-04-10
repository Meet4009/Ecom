// External Imports
const express = require('express');

// Internal Imports
const userController = require('../controllers/userController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');
const { multipleProductUpload } = require("../middlewares/upload"); // Middleware for file uploads
const productController = require('../controllers/productController'); // Import product controller

const router = express.Router();

router.get('/dashboard', authMiddleware, authorizeRoles("admin"), userController.adminDashboard);
// Route to create a new Product
router.post('/create', authMiddleware, authorizeRoles('admin'), multipleProductUpload, productController.createProduct);// Ensure this middleware is applied first

// Route to get all Products (Admin only)
router.get('/', authMiddleware, productController.getAllProducts);

// Route to get a single Product by ID
router.get('/:id', authMiddleware, productController.getSingleProduct);

// Route to update a Product by ID (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('admin'), productController.updateProduct);

// Route to delete a Product by ID (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), productController.deleteProduct);

module.exports = router;
