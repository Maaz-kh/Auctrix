const express = require("express");
const router = express.Router();
const auth = require('../controllers/auth');
const otpSender = require('../controllers/otpSender');

// Route to register User
router.post('/register', auth.register);
// Route to Login User
router.post('/login', auth.login);
// Route to generate and store OTP
router.post('/forget-password/request', otpSender.generateOtp);
// Route to verify OTP
router.post('/forget-password/verify', otpSender.verifyOtp);

module.exports = router;
