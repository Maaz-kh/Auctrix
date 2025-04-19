const Auction = require("../models/auctionModel");
const Product = require("../models/productModel");
const User = require("../models/userModel")

// Function to get Total Active Auctions
const getTotalActiveAuctions = async (req, res) => {
  try {
    const activeAuctions = await Auction.find({
      auction_status: 'Active',
      expire_at: { $gt: new Date() }
    })
    .populate({
      path: 'product_id',
      populate: {
        path: 'seller_id',
        select: 'username'
      }
    })
    .lean();

    // For each auction, find the highest bid and populate bidder
    const populatedAuctions = await Promise.all(activeAuctions.map(async (auction) => {
      
      if (auction.total_bids.length > 0) {
        // Get the highest bid
        const maxBid = auction.total_bids.reduce((max, curr) =>
          curr.bid_amount > max.bid_amount ? curr : max
        );

        // Fetch bidder's username
        const bidder = await User.findById(maxBid.bidder_id).select('username');

        // Attach current bid and leading bidder to the object
        return {
          ...auction,
          current_bid: maxBid.bid_amount,
          leading_bidder: bidder?.username || 'N/A',
        };
      } else {
        return {
          ...auction,
          current_bid: 0,
          leading_bidder: 'No Bids',
        };
      }
    }));

    res.status(200).json({data:populatedAuctions});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active auctions.', error: error.message });
  }
};

// Get Recent Auctions (Completed/Expired Auctions)
const getRecentAuctions = async (req, res) => {
  try {
    const currentTime = new Date(); // Get current time

    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    // Fetch auctions where auction_status is "Completed" OR auction has expired
    let auctionQuery = Auction.find({
      $or: [
        { auction_status: "Completed" },  // Completed auctions
        { expire_at: { $lt: currentTime }, auction_status: { $ne: "Completed" } } // Expired auctions
      ]
    })
      .populate({
        path: "product_id",
        select: "name category images seller_id",
        populate: {
          path: "seller_id",
          select: "username" 
        }
      })
      .sort({ posting_time: -1 }); // Sort by expire time (latest expired auctions first)

    // Apply limit only if provided
    if (limit) {
      auctionQuery = auctionQuery.limit(limit);
    }

    const recentAuctions = await auctionQuery.exec();

    // Format response and update expired auctions
    const formattedAuctions = recentAuctions.map(auction => {
      let auctionStatus = auction.auction_status;

      // If expired and not completed, mark as Expired
      if (auction.expire_at < currentTime && auction.auction_status !== "Completed") {
        auctionStatus = "Expired";
      }

      return {
        ...auction.toObject(),
        auction_status: auctionStatus, // Include updated status in response
      };
    });

    return res.status(200).json({ data: formattedAuctions });
  } catch (error) {

    console.error("Error fetching Recent Auctions:", error);
    return res.status(500).json({success: false,  message: "Error fetching recent auctions"});
  }
};

// Function to get Total Auction based on the query
const getAuctionsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const currentTime = new Date();

    let query = {};

    if (status === 'completed') {
      query = { auction_status: 'Completed' };
    } else if (status === 'expired') {
      query = {
        auction_status: { $ne: 'Completed' },
        expire_at: { $lt: currentTime }
      };
    } else {
      
      query = {
        $or: [
          { auction_status: 'Completed' },
          { 
            auction_status: { $ne: 'Completed' },
            expire_at: { $lt: currentTime }
          }
        ]
      };
    }

    const auctions = await Auction.find(query);

    return res.status(200).json({data: auctions});
  } catch (error) {
    console.error('Error fetching auctions by status:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Function to Get Total Bids Activity Per Category
const getBidActivityPerCategory = async (req, res) => {
  
  try {
    const bidActivityData = await Auction.aggregate([
      
      { $match: { auction_status: "Completed" } },

      // Unwind the total_bids array to get each individual bid
      { $unwind: "$total_bids" },
      
      // Lookup the category from the associated product
      {
        $lookup: {
          from: "products", 
          localField: "product_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      // Flatten the product details
      { $unwind: "$productDetails" },
      
      // Group by product category and count the number of bids
      {
        $group: {
          _id: "$productDetails.category", // Group by product category
          totalBids: { $sum: 1 } // Count the number of bids
        }
      },
      
      // Sort by number of bids in descending order
      { $sort: { totalBids: -1 } },
      
      // Project the desired fields (category and total bids)
      {
        $project: {
          category: "$_id",
          totalBids: 1,
          _id: 0
        }
      }
    ]);

    return res.status(200).json({ data: bidActivityData });
  } catch (error) {
    
    return res.status(500).json({success: false, message: "Error fetching bid activity per category"});
  }
};

// Function to get Top Performing Sellers (Sellers who have generated most revenue)
const getTopPerformingSellers = async (req, res) => {
  try {
    const sellerStats = await Auction.aggregate([
      // Match only Completed or Expired auctions
      {
        $match: {
          auction_status: { $in: ["Completed", "Expired"] }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.seller_id",
          totalAuctions: { $sum: 1 }, // Completed + Expired
          totalSuccessfulAuctions: {
            $sum: { $cond: [{ $eq: ["$auction_status", "Completed"] }, 1, 0] }
          },
          totalUnsuccessfulAuctions: {
            $sum: { $cond: [{ $eq: ["$auction_status", "Expired"] }, 1, 0] }
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$auction_status", "Completed"] },
                "$final_bid.bid_amount",
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "sellerDetails"
        }
      },
      { $unwind: "$sellerDetails" },
      {
        $project: {
          sellerId: "$_id",
          sellerName: "$sellerDetails.username",
          totalAuctions: 1,
          totalSuccessfulAuctions: 1,
          totalUnsuccessfulAuctions: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalRevenue: -1 } } // Sort sellers by total revenue
    ]);

    return res.status(200).json({ data: sellerStats });
  } catch (error) {
    console.error("Error fetching top performing sellers:", error);
    return res.status(500).json({ message: "Error fetching seller statistics" });
  }
};


// Function to set Minimum bid for a product
const setMinimumBid = async (req, res) => {

  const { auctionId } = req.params;
  const { minBid } = req.body;

  if (!auctionId || !minBid) {
    return res.status(400).json({ error: 'Auction ID and Minimum bid are required.' });
  }
  if (minBid <= 0) {
    return res.status(400).json({ error: 'Minimum bid must be a positive number.' });
  }

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found.' });
    }

    auction.min_bid = minBid;
    await auction.save();

    res.status(200).json({ message: 'Minimum bid Updated Successfully!', auction });
  } 
  catch (error) {
    return res.status(500).json({ error: 'Error While Updating Min Bid.' });
  }
};

// Function to update Auction Duration (expire time)
const setAuctionDuration = async (req, res) => {
  const { auctionId } = req.params;
  const { durationInHours } = req.body; // Expect duration in hours

  if (!auctionId || !durationInHours || durationInHours <= 0) {
    return res.status(400).json({ error: 'Valid Auction ID and duration (in hours) are required.' });
  }

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found.' });
    }

    auction.expire_at = new Date(Date.now() + durationInHours * 60 * 60 * 1000); // Update expire time
    await auction.save();

    return res.status(200).json({ message: 'Auction duration updated successfully!', auction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error while updating auction duration.' });
  }
};

module.exports = { getTotalActiveAuctions, getRecentAuctions, getAuctionsByStatus,getBidActivityPerCategory, getTopPerformingSellers };