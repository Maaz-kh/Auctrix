const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "bidder"],
      required: true,
    },
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    profileImage: {
      type: String,
      default: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
    },

    // Seller-Specific Fields
    businessInfo: {
      businessName: { type: String, trim: true },
      taxId: { type: String, trim: true },
      address: { type: String },
      bio: { type: String, maxlength: 500 },
    },
    verificationStatus: {
      documentVerified: { type: Boolean, default: false },
      addressVerified: { type: Boolean, default: false },
      paymentVerified: { type: Boolean, default: false },
    },

    // OTP Fields
    otp: {
      value: { type: String, default: null },
      time: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Middleware: Hash password before saving the user
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10); // Salt factor: 10
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;