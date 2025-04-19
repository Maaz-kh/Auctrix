const express = require("express");
const router = express.Router();
const auth = require('../controllers/auth');
const {authMiddleware} = require("../middlewares/authMiddleware");
const { upload, uploadImage } = require('../controllers/cloudinary');
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const auctionController = require("../controllers/auctionController");

                                // Admin Dashboard and Active Auctions

 // Get all Active Auctions/Products
router.get('/get-active-auctions', auctionController.getTotalActiveAuctions);
// Get Recent Active Auctions
router.get('/get-recent-auctions', auctionController.getRecentAuctions);
  
                                // Admin Profile
 // Get User Details
router.get('/get-user-details', authMiddleware, adminController.getUserDetails);
// Update User Details
router.put('/update-user-details', authMiddleware,adminController.updateUserDetails);
// Upload Image
router.post('/uploadImage', upload.single('image'), uploadImage);

                            // Manage Sellers and bidders

// Get All Sellers by admin
router.get('/get-all-sellers', adminController.getAllUsers("seller"));
// Get All Bidders by admin
router.get('/get-all-bidders', adminController.getAllUsers("bidder"));
// Delete Seller/Bidder by admin
router.delete('/deleteUser/:userId', adminController.deleteUser);

                            // Managing(Approving/Declining) Products for Auction

// Get all Pending products
router.get('/products/get-pending-products', productController.getAllListedProducts);
// Approve a product
router.put('/products/approve/:productId', productController.approveProduct);
// Decline a product
router.put('/products/decline/:productId', productController.declineProduct);


                            // Analytics (Get Auctions(Total, Completed, Expired)Top Performing Sellers, Total Bids Placed Per Products Category)

// Get Auctions by status (Completed, Expired)
router.get('/get-auctions-by-status', auctionController.getAuctionsByStatus);
// Get Bids Placed Per Prcoduct Category
router.get('/get-bids-activity', auctionController.getBidActivityPerCategory);
// Get Top Performing Sellers
router.put('/get-top-performing-sellers', auctionController.getTopPerformingSellers);

module.exports = router;
