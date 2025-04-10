const multer = require('multer');
const path = require('path');

// Configuration constants
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// Configure Storage
const configureStorage = (destinationPath) => {
    return multer.diskStorage({
        destination: destinationPath,
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const random = Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${timestamp}-${random}${ext}`);
        }
    });
};

// File Filter
const fileFilter = (allowedTypes) => (req, file, cb) => {
    const isAllowed = allowedTypes.includes(file.mimetype);
    cb(isAllowed ? null : new Error(`Only ${allowedTypes.join(', ')} are allowed`), isAllowed);
};

// User Upload Configuration
const userUpload = multer({
    storage: configureStorage('uploads/users'),
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter: fileFilter(ALLOWED_IMAGE_TYPES)
}).single('profileImage');

// Product Upload Configuration
const productUpload = multer({
    storage: configureStorage('uploads/products'),
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter: fileFilter(ALLOWED_IMAGE_TYPES)
}).array('productImages', 10);

module.exports = {
    upload: userUpload,
    multipleProductUpload: productUpload
};