const User = require("../models/userModel");

// Function to get user details
const getUserDetails = async (req, res) => {
  try {
  
    const user = await User.findById(req.userId).select(
      'username businessInfo verificationStatus profileImage email contactNumber'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Function to delete Seller/Bidder by admin
const deleteUser = async (req, res) => {

  try {
    const { userId } = req.params;

    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "Seller/Bidder not Found." });
    }

    res.status(200).json({ success: true, message: "User deleted successfully." });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error while deleting User" });
  }
};

// Function to get all users based on role 
const getAllUsers = (userRole) => {

  const validRoles = ["seller", "bidder"];
  if (!validRoles.includes(userRole)) {
    throw new Error(`Invalid user role: ${userRole}`);
  }
  return async (req, res) => {
    try {
      const users = await User.find({ role: userRole }).select("-password -otp")

      if (!users) {
        return res.status(404).json({ success: false, message: `No ${userRole}s found.` });
      }

      res.status(200).json({ success: true, message: `List of ${userRole}s: `, data: users });
    } catch (error) {

      res.status(500).json({ success: false, message: `Error while fetchin ${userRole}s `, error: error.message });
    }
  }
}

// Function to update user details
const updateUserDetails = async (req, res) => {
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

    res.status(200).json({ data: user }); // Return the updated user
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};


module.exports = { getUserDetails, deleteUser, getAllUsers, updateUserDetails };
