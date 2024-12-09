const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware')
const sellerProfile = require('../controllers/sellerProfileController')


// Profile - Management
router.get('/profile', authMiddleware, sellerProfile.getSellerProfile);
router.put('/profile', authMiddleware, sellerProfile.updateSellerProfile);
router.post('/upload-profile-image', authMiddleware, sellerProfile.updateProfileImage);

module.exports = router;