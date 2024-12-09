const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sellerRoutes = require('./routes/sellerRoutes');

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
// Middleware
app.use(
    cors({
      origin: "http://localhost:3000", // Frontend URL
      credentials: true, // Allow credentials (cookies)
    })
  );
app.use(express.json());

// User Routes
app.use('/api/user', userRoutes);
// Admin Routes
app.use('/api/admin', adminRoutes);
// Seller Routes
app.use('/seller', sellerRoutes);

// Mongoose setup
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

    // Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
