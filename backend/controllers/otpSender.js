const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const User = require('../models/userModel');

// Function to generate a 4-digit OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Random 4-digit string
}

// Function to send OTP via email
async function sendEmail(email, otp) {
    const sendingMail = 'danishrafiq708@gmail.com';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sendingMail,
            pass: 'bfdj alqh wioc lgzz', // Email password / app password
        },
    });

    const mailOptions = {
        from: sendingMail,
        to: email,
        subject: 'AUCTRIX - OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
}

// Function to generate and store OTP
const generateOtp = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const otp = generateOTP(); // Generate the OTP
      const otpExpirationTime = new Date();
  
      // Save OTP and timestamp in the database
      user.otp = {
        value: otp,
        time: otpExpirationTime,
      };
      await user.save();
  
      // Send OTP via email (or any notification service)
      await sendEmail(email, otp);
      res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
      console.error('Error generating OTP:', error);
      res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};
  

// Route to verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp, password } = req.body;
  
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP and Password are required.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if OTP exists and has not expired
      if (user.otp && user.otp.value === otp) {
        const currentTime = new Date();
        const otpExpirationTime = new Date(user.otp.time);
        const expirationLimit = 1 * 60 * 1000; // 5 minutes in milliseconds
  
        if (currentTime - otpExpirationTime <= expirationLimit) {
          user.otp = { value: null, time: null }; // Clear the OTP after successful verification
          user.password = await bcrypt.hash(user.password, 10);
          await user.save();
          return res.status(200).json({ message: 'OTP verified successfully.' });
        }
  
        return res.status(400).json({ message: 'OTP expired.' });
      }
  
      res.status(400).json({ message: 'Invalid OTP.' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};
  
module.exports = {
    generateOtp,
    verifyOtp
};