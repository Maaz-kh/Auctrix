import React, { useState, useEffect } from "react";
import Sidebar from "../sellerComponents/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRequest, putRequest, postFormData } from "../axios";
import {
  User,
  Box,
  Shield,
  Edit,
  Save,
  Camera,
  CreditCard,
  MapPin,
  Mail,
} from "lucide-react";

// Seller Profile Management Page
const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getRequest('http://localhost:5000/seller/profile');
        setProfile(response);
        setEditProfile({ ...response });
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Profile image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await postFormData('http://localhost:5000/seller/upload-profile-image', formData);

        // Update profile with new image URL
        setEditProfile(prev => ({
          ...prev,
          profileImage: response.imageUrl
        }));
        setProfile(prev => ({
          ...prev,
          profileImage: response.imageUrl
        }));

        toast.success("Profile image uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload profile image");
      }
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      const response = await putRequest('http://localhost:5000/seller/update-profile', editProfile);
      
      // Update profile with backend response
      setProfile(response);
      setEditProfile(response);
      setIsEditing(false);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditProfile({ ...profile });
    setIsEditing(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state if no profile
  if (!profile) {
    return (
      <div className="flex">
        <ToastContainer />
        <Sidebar selectedItem="Profile" />
        <div className="ml-64 w-full bg-gray-50 min-h-screen p-8 flex justify-center items-center">
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  // Provide default values to prevent undefined errors
  const defaultProfile = {
    profileImage: 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    taxId: '',
    address: '',
    bio: '',
    verificationStatus: {
      documentVerified: false,
      addressVerified: false,
      paymentVerified: false
    }
  };

  // Merge default values with existing profile
  const safeProfile = { ...defaultProfile, ...profile };
  const safeEditProfile = { ...defaultProfile, ...editProfile };

  return (    
    <div className="flex">
      <ToastContainer />
      <Sidebar selectedItem="Profile" />
      <div className="ml-64 w-full bg-gray-50 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="relative">
              <img
                src={safeEditProfile.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
              />
              {isEditing && (
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600"
                >
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {safeProfile.firstName} {safeProfile.lastName}
              </h1>
              <p className="text-gray-600">{safeProfile.businessName}</p>
            </div>
            <div className="ml-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <Edit size={20} className="mr-2" /> Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    <Save size={20} className="mr-2" /> Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2 text-blue-600" size={24} />
                Personal Information
              </h2>
              {!isEditing ? (
                <>
                  <p><strong>First Name:</strong> {safeProfile.firstName}</p>
                  <p><strong>Last Name:</strong> {safeProfile.lastName}</p>
                  <p><strong>Email:</strong> {safeProfile.email}</p>
                  <p><strong>Phone:</strong> {safeProfile.phone}</p>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={safeEditProfile.firstName}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="First Name"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={safeEditProfile.lastName}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Last Name"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    type="email"
                    value={safeEditProfile.email}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Email"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    type="tel"
                    value={safeEditProfile.phone}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Phone Number"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Business Information Section */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Box className="mr-2 text-blue-600" size={24} />
                Business Details
              </h2>
              {!isEditing ? (
                <>
                  <p><strong>Business Name:</strong> {safeProfile.businessName}</p>
                  <p><strong>Tax ID:</strong> {safeProfile.taxId}</p>
                  <p><strong>Address:</strong> {safeProfile.address}</p>
                  <p className="mt-4">{safeProfile.bio}</p>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={safeEditProfile.businessName}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    placeholder="Business Name"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={safeEditProfile.taxId}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        taxId: e.target.value,
                      }))
                    }
                    placeholder="Tax ID"
                    className="w-full p-2 border rounded-lg"
                  />
                  <textarea
                    value={safeEditProfile.address}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Business Address"
                    className="w-full p-2 border rounded-lg"
                  />
                  <textarea
                    value={safeEditProfile.bio}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    placeholder="Short Bio"
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Verification Status Section */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-blue-600" size={24} />
              Verification Status
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <CreditCard className="mr-2 text-green-500" size={20} />
                  Document Verification
                </h3>
                <p
                  className={`
                  font-semibold 
                  ${
                    safeProfile.verificationStatus.documentVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                `}
                >
                  {safeProfile.verificationStatus.documentVerified
                    ? "Verified"
                    : "Pending"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <MapPin className="mr-2 text-green-500" size={20} />
                  Address Verification
                </h3>
                <p
                  className={`
                  font-semibold 
                  ${
                    safeProfile.verificationStatus.addressVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                `}
                >
                  {safeProfile.verificationStatus.addressVerified
                    ? "Verified"
                    : "Pending"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <Mail className="mr-2 text-green-500" size={20} />
                  Payment Verification
                </h3>
                <p
                  className={`
                  font-semibold 
                  ${
                    safeProfile.verificationStatus.paymentVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                `}
                >
                  {safeProfile.verificationStatus.paymentVerified
                    ? "Verified"
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;