const Product = require('../models/productModel');
const Auction = require('../models/auctionModel');

const addProduct = async (req, res) => {
    try {
      const { name, category, description, images, videos, seller_id } = req.body;
  
      // Validation
      if (!name || !category || !description || !seller_id) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
      }
  
      // Create new product
      const newProduct = new Product({
        name,
        category,
        description,
        images,
        videos,
        seller_id,
      });
  
      const savedProduct = await newProduct.save();
  
      res.status(201).json({ message: 'Product added successfully.', product: savedProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: 'Error adding product.', error });
    }
  };


// Function to Approve Product
const approveProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Auction.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product's approval status to approved
    product.approval_status = 'approved';
    await product.save();

    res.status(200).json({ message: 'Product Approved For Auction Successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error approving product', error });
  }
};

// Function to Decline Product
const declineProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Auction.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product's approval status to rejected
    product.approval_status = 'rejected';
    await product.save();

    res.status(200).json({
      message: 'Product declined. It is still available for approval later.',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error declining product', error });
  }
};  

// Function to fetch all products with pending or rejected status
const getAllProducts = async (req, res) => {
  try {
    
    // Fetch products with pending or rejected status
    const products = await Auction.find({})
    .populate('product_id')
    .populate('bidder_id', 'username email');

    if (products.length === 0) {
      return res.status(404).json({ message: 'No pending or rejected products found.' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products.', error });
  }
};


module.exports = {addProduct, approveProduct, declineProduct, getAllProducts}