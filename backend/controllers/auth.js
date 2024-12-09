const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv").config()

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user._id, userRole: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );
  return accessToken;
}

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).send("Invalid Credentials."); // Add return
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send("Email already registered"); // Add return
    }
    if (role.toLowerCase() === "admin") {
      return res.status(401).send("Unauthorized!!! Cannot add admin directly."); // Add return
    }
    if (role.toLowerCase() !== "bidder" && role.toLowerCase() !== "seller") {
      return res.status(422).send(`Invalid role: ${role}.`); // Add return
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(400).send(error.message); // Add return
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Invalid Credentials");
    }

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid email or password");
    }
    
    // Generate new tokens
    const accessToken = generateTokens(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email
        },
        accessToken,
        role: user.role
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
    register, 
    login
}