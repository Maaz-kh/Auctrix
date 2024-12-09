const cloudinary = require('cloudinary').v2;

const CLOUDINARY_CLOUD_NAME = 'dispyhlim';
const CLOUDINARY_API_KEY = '327494285125371';
const CLOUDINARY_API_SECRET = '6TNmjzMIamgrY0X-gdeO6r4aWkE';

// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

// Function to upload an image
const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "auctrix_uploads", 
      use_filename: true,
      unique_filename: false
    });

    console.log("Image Uploaded Successfully:", result);
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

module.exports = { uploadImage };