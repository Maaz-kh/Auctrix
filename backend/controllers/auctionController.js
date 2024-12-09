const Auction = require("../models/auctionModel");
const Product = require("../models/productModel");

// Function to get Total Active Auctions
const getTotalActiveAuctions = async (req, res) => 
{
    const currentDate = Date.now();
    try {
      
      // Fetch total active products where approval status is 'approved' and it is not expired
      const activeProducts = await Auction.find({
        approval_status: 'approved',
        expire_at: { $gt: currentDate }
      }).populate('product_id');
  
      res.status(200).json(activeProducts.length);
    } catch (error) {

      res.status(500).json({ message: 'Error fetching active products.'});
    }
  };

// Get Recent Auctions
const getRecentAuctions = async (req, res) => {
  try {
    
    const recentAuctions = await Auction.find()
      .sort({ posting_time: -1 })  // Sort by posting_time in descending order
      .limit(5);  

    // Send the response with the recent auctions
    res.status(200).json({success: true, data: recentAuctions, });
  } catch (error) {

    console.error('Error fetching Recent Auctions:', error);
    res.status(500).json({success: false,message: 'Error fetching recent auctions',
    });
  }
};

// Function to set Minimum bid for a product
const setMinimumBid = async (req, res) => {

    const { auctionId }  = req.params;
    const {minBid} = req.body;

    if (!auctionId || !minBid) 
    {
        return res.status(400).json({ error: 'Auction ID and Minimum bid are required.' });
    }
    if (minBid <= 0) {
      return res.status(400).json({ error: 'Minimum bid must be a positive number.' });
    }

    try { 
      const auction = await Auction.findById(auctionId);
      if (!auction) 
      {
          return res.status(404).json({ error: 'Auction not found.' });
      }

        auction.min_bid = minBid;
        await auction.save();

        res.status(200).json({ message: 'Minimum bid Updated Successfully!', auction });
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Error While Updating Min Bid.'});
    }
};

// Function to set Auction  for a product
const setAuctionDuration = async (req, res) => {

  const { auctionId }  = req.params;
  const {duration} = req.body;

  if (!auctionId || !duration) 
  {
      return res.status(400).json({ error: 'Auction ID and Duration are required.' });
  }

  try {
      
    const auction = await Auction.findById(auctionId);
    if (!auction) 
    {
        return res.status(404).json({ error: 'Auction not found.' });
    }

      auction.time_span = duration;
      await auction.save();

      res.status(200).json({ message: 'Auction Duration Updated Successfully!', auction });
  } catch (error) {

      console.error(error);
      res.status(500).json({ error: 'Error While Updating Auction Duration.'});
  }
};


module.exports = {getTotalActiveAuctions, getRecentAuctions};