// External Imports
const express = require('express');

// Internal Imports
const userController = require('../controllers/userController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');
const { upload } = require("../middlewares/upload"); // Destructure upload from the exported object

const router = express.Router();

// ✅ User Authentication Routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', authMiddleware, userController.logout); 
// ✅ User Profile Routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload, userController.updateProfile);

// ✅ User Password Routes
router.put('/password/update', authMiddleware, userController.updatePassword);
router.post('/password-forgot', userController.forgotPassword);
router.put('/password/reset/:token', userController.resetPassword);

// ✅ Admin Only Routes
router.get('/users', authMiddleware, authorizeRoles("admin"), userController.getAllUsers);
router.get('/user/:id', authMiddleware, authorizeRoles("admin"), userController.getUserDetails);
router.put('/user/:id', authMiddleware, authorizeRoles("admin"), userController.updateUser);
router.delete('/user/:id', authMiddleware, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;