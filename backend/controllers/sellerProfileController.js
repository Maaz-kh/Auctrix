const User = require('../models/userModel');
const cloudinary = require('./cloudinary');

const getSellerProfile = async (req, res) => {
  try {
    // Find user and return relevant seller information
    const user = await User.findById(req.userId).select(
      'personalInfo businessInfo verificationStatus profileImage email contactNumber'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Transform the user data to match the frontend expectation
    const profileData = {
      firstName: user.personalInfo.firstName,
      lastName: user.personalInfo.lastName,
      email: user.email,
      phone: user.personalInfo.phone,
      businessName: user.businessInfo.businessName,
      taxId: user.businessInfo.taxId,
      address: user.businessInfo.address,
      bio: user.businessInfo.bio,
      profileImage: user.profileImage || 'default-profile.jpg',
      verificationStatus: user.verificationStatus
    };

    res.status(200).json(profileData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

const updateSellerProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true } // Ensures updated data is returned and validated
    ).select('-password -otp');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({data: user}); // Return the updated user
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};


// UPLOAD Profile Image
const updateProfileImage = async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploadImage(req.file);

      // Update user's profile image
      const user = await User.findById(req.userId);
      user.profileImage = result.secure_url;
      await user.save();

      res.status(200).json({ 
        message: 'Profile image uploaded successfully', 
        imageUrl: result.secure_url 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error uploading profile image', 
        error: error.message 
      });
    }
};

module.exports = {
  getSellerProfile,
  updateSellerProfile,
  updateProfileImage
};