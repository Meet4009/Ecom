// External Imports
const express = require('express');

// Internal Imports
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');
const { multipleProductUpload } = require("../middlewares/upload"); // Middleware for file uploads
const productController = require('../controllers/productController'); // Import product controller

const router = express.Router();

// deshbord
router.get('/dashboard', authMiddleware, authorizeRoles("admin"), productController.adminDashboard);

// create a new Product
router.post('/create', authMiddleware, authorizeRoles('admin'), multipleProductUpload, productController.createProduct);

// get all Products (Admin only)
router.get('/', productController.getAllProducts);

// get a single Product by ID
router.get('/:id', productController.getSingleProduct);

// update a Product by ID (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('admin'), productController.updateProduct);

// delete a Product by ID (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), productController.deleteProduct);

// update product images (Admin only)
router.put('/:id/images', 
    authMiddleware, 
    authorizeRoles('admin'), 
    multipleProductUpload, 
    productController.updateProductImages
);

// Review routes
router.post('/:id/review', authMiddleware, productController.createProductReview);
router.get('/:id/reviews', productController.getProductReviews);
router.delete('/:id/review', authMiddleware, productController.deleteReview);

router.put('/:id/review/:reviewId', authMiddleware, authorizeRoles('admin'), productController.updateReview);
router.delete('/:id/review/:reviewId', authMiddleware, authorizeRoles('admin'), productController.deleteReviewById);
module.exports = router;