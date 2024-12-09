const express = require("express");
const router = express.Router();
const auth = require('../controllers/auth');
const {authMiddleware} = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const auctionController = require("../controllers/auctionController");

                            // Admin Dashboard

 // Get all Active Auctions/Products
router.get('/dashboard/get-total-active-auctions', auctionController.getTotalActiveAuctions);
// Get Recent Active Auctions
router.get('/dashboard/get-recent-auctions', auctionController.getRecentAuctions);
  
                            // Admin Profile
 // Get User Details
 router.get('/get-user-details', authMiddleware, adminController.getUserDetails);
// Get User Details
router.put('/update-user-details', authMiddleware,adminController.updateUserDetails);

                          // Manage Sellers and bidders

// Route to getAllSellers by admin
router.get('/get-all-sellers', adminController.getAllUsers("seller"));
// Route to getAllSellers by admin
router.get('/get-all-bidders', adminController.getAllUsers("bidder"));
// Route to delete Seller/Bidder by admin
router.delete('/deleteUser/:userId', adminController.deleteUser);

                // Managing(Approving/Declining) Products for Auction  Routes

// Get all products
router.get('/products/get-pending-products', productController.getAllProducts);
// Approve a product
router.put('/products/approve/:productId', productController.approveProduct);
// Decline a product  Get Method For Now
router.get('/products/decline/:productId', productController.declineProduct);

                            

module.exports = router;
