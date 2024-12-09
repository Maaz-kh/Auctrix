const User = require("../models/userModel");

const deleteUser = async (req, res) => {
    
    try {
      const {userId} = req.params;

      const deletedUser = await User.findOneAndDelete({ _id: userId });
  
      if (!deletedUser) {
        return res.status(404).json({ success: false, message: "Seller/Bidder not Found." });
      }
  
      res.status(200).json({ success: true, message: "User deleted successfully." });
    
    }catch (error) {
        res.status(500).json({ success: false, message: "Error while deleting User"});
    }
  };
  
const getAllUsers = (userRole) =>{
    
    const validRoles = ["seller", "bidder"];
    if (!validRoles.includes(userRole)) {
        throw new Error(`Invalid user role: ${userRole}`);
    }

    return async (req, res) =>{
        try {
            const users = await User.find({role: userRole}).select("-password -otp")
            
            if (!users) 
            {
                return res.status(404).json({ success: false,  message: `No ${userRole}s found.`});
            }
    
            res.status(200).json({ success: true, message: `List of ${userRole}s: `, data: users });
        } catch (error) {
            
            res.status(500).json({ success: false, message: `Error while fetchin ${userRole}s `, error: error.message});
          }
    }
  }

// Function to get user details
const getUserDetails = async (req, res) => {
  try {
    
    const userId = req.userId; 
    const user = await User.findById(userId).select('-password -otp'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({data: user});
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update user details
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId; 
    const updates = req.body; // Fields to be updated

    // If password is being updated, hash the new password
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password -otp');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User details updated Successfully', data: user});
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getUserDetails, deleteUser, getAllUsers, updateUserDetails };
