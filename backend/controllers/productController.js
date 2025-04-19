const Product = require('../models/productModel');
const Auction = require('../models/auctionModel');

const addProduct = async (req, res) => {
  try {
    const { name, category, description, images } = req.body;

    const seller_id = req.userId;

    // Check if user exists
    const user = await User.findById(seller_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Validation
    if (!name || !category || !description || !seller_id) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create new product
    const newProduct = new Product({
      name,
      category,
      description,
      images,
      seller_id,
    });

    const savedProduct = await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully.", product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product.", error });
  }
};


const getSellerProducts = async (req, res) => {
  try {
    // Get the seller ID from the authenticated request
    const seller_id = req.userId;

    // Find all products for the seller
    const products = await Product.find({ seller_id });

    // Fetch auctions for these products
    const productIds = products.map(product => product._id);
    const auctions = await Auction.find({
      product_id: { $in: productIds }
    });

    // Combine products with their auction details
    const productsWithAuctions = products.map(product => {
      // Find the corresponding auction for this product
      const auction = auctions.find(auction =>
        auction.product_id.toString() === product._id.toString()
      );

      // Adjust the approval_status dynamically
      const adjustedAuction = auction
        ? {
          ...auction.toObject(),
          approval_status: auction.approval_status === "Approved" ? "Active" : auction.approval_status
        }
        : null;

      // Return product with adjusted auction details
      return {
        ...product.toObject(), // Convert to plain object
        auction: adjustedAuction // Attach adjusted auction or null
      };
    });

    res.status(200).json({
      success: true,
      products: productsWithAuctions
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};


const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, category, description, images } = req.body;

    // Validate required fields
    if (!name || !category || !description) {
      return res.status(400).json({
        message: 'Name, category, and description are required'
      });
    }

    // Find the product and ensure the seller is the owner
    const product = await Product.findOne({
      _id: productId,
      seller_id: req.userId // Assuming authMiddleware adds user to the request
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    // Update product fields
    product.name = name;
    product.category = category;
    product.description = description;

    // Handle images 
    // This assumes images are already processed (as URLs) before reaching the backend
    if (images && Array.isArray(images)) {
      product.images = images;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    // Return the updated product
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product to ensure it exists and belongs to the seller
    const product = await Product.findOne({
      _id: productId,
      seller_id: req.userId // Assuming req.userId is set via authentication middleware
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    // Delete any associated auction entry
    const auction = await Auction.findOne({ product_id: productId });
    if (auction) {
      await Auction.findByIdAndDelete(auction._id);
    }

    res.status(200).json({ message: 'Product and associated auction (if any) deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Function to Approve Product
const approveProduct = async (req, res) => {
  const { productId } = req.params;

  try {

    const product = await Product.findByIdAndUpdate(
      productId,
      { approval_status: 'Approved' },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error approving product', error });
  }
};

// Function to Decline Product
const declineProduct = async (req, res) => {
  const { productId } = req.params;

  try {

    const product = await Product.findByIdAndUpdate(
      productId,
      { approval_status: 'Rejected' },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error Declining product', error });
  }
};

// Function to Fetch all the products waiting to be auctioned or currently in auction
const getAllListedProducts = async (req, res) => {
  try {

    // Fetch products with pending or rejected status
    const products = await Product.find({
      $or: [
        {listing_status: "Listed"},
        {listing_status: "Inauction"}
      ]
      }
    ).populate("seller_id", "username");

    if (products.length === 0) {
      return res.status(404).json({ message: 'No pending or rejected products found.' });
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products.', error });
  }
};


module.exports = { approveProduct, declineProduct, getAllListedProducts, addProduct, getSellerProducts, editProduct, deleteProduct }