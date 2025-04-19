import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getRequest, putRequest, postFormData } from "../axios";
import { User, Box, Shield, Edit, Save, Camera, CreditCard, MapPin, Mail, CheckCircle, Clock, X } from "lucide-react";
import Loading from "../components/Loading";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Default profile structure matching the User model
  const defaultProfile = {
    username: "",
    email: "",
    contactNumber: "",
    businessInfo: {
      businessName: "",
      taxId: "",
      address: "",
      bio: "",
    },
    verificationStatus: {
      documentVerified: false,
      addressVerified: false,
      paymentVerified: false,
    },
  };

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {

      try {
        setIsLoading(true);
        const response = await getRequest("http://localhost:5000/api/admin/get-user-details");

        // Ensure the response matches the default profile structure
        const formattedProfile = {
          ...defaultProfile,
          ...response,
          profileImage: response.profileImage || "https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg",
          businessInfo: {
            ...defaultProfile.businessInfo,
            ...response.businessInfo,
          },
          verificationStatus: {
            ...defaultProfile.verificationStatus,
            ...response.verificationStatus,
          },
        };
        setProfile(formattedProfile);
        setEditProfile({ ...formattedProfile });
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Modified saveProfile function
  const saveProfile = async () => {
    try {
      let imageUrl = editProfile.profileImage;

      // Check if there's a new image file to upload
      const imageInput = document.getElementById("image-upload");
      if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const formData = new FormData();
        formData.append("image", file);

        // Upload image first
        const imageUploadResponse = await postFormData("http://localhost:5000/api/admin/uploadImage", formData);

        // Use the uploaded image URL
        imageUrl = imageUploadResponse.imageUrl;
        console.log(imageUrl)
      }

      // Prepare the payload to match the User model structure
      const profilePayload = {
        username: editProfile.username,
        email: editProfile.email,
        contactNumber: editProfile.contactNumber,
        profileImage: imageUrl,
        businessInfo: {
          businessName: editProfile.businessInfo.businessName,
          taxId: editProfile.businessInfo.taxId,
          address: editProfile.businessInfo.address,
          bio: editProfile.businessInfo.bio,
        },
      };

      const response = await putRequest("http://localhost:5000/api/admin/update-user-details", profilePayload);

      // Update profile with backend response
      setProfile({
        ...editProfile,
        profileImage: imageUrl,
        ...response,
      });
      setEditProfile({
        ...editProfile,
        profileImage: imageUrl,
        ...response,
      });
      setIsEditing(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      // Create a FileReader to preview the image
      const reader = new FileReader();

      reader.onloadend = () => {
        // Update the profile image with the local file preview
        setEditProfile(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
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
      <Loading />
    );
  }

  // Render error state if no profile
  if (!profile) {
    return (
      <div className="flex">
        <ToastContainer />
        <div className="ml-64 w-full bg-gray-50 min-h-screen p-8 flex justify-center items-center">
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <ToastContainer />
      <div className="w-full md:p-4 mt-12 md:mt-0 bg-gray-50 min-h-screen p-4">

        <h1 className="text-3xl md:text-3xl font-bold text-[#0a5274] mb-4 md:pb-4">My Profile</h1>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
            {/* Profile Image */}
            <div className="relative self-center md:self-start">
              <img
                src={editProfile.profileImage || profile.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"/>
              {isEditing && (
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
                  
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    className="hidden"
                    onChange={handleImageUpload}/>
                </label>
              )}
            </div>

            {/* Username & Business Info (only show on md+) */}
            <div className="hidden md:block p-4">
              <h1 className="text-3xl font-bold text-gray-800">{profile.username}</h1>
              <p className="text-gray-600">{profile.businessInfo.businessName}</p>
            </div>

            {/* Edit / Save / Cancel Buttons */}
            <div className="flex justify-center md:ml-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  <Edit size={20} className="mr-2" /> Edit Profile
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
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
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Username</span>
                    <span className="font-medium">{profile.username}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="font-medium">{profile.contactNumber || "N/A"}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editProfile.username}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      placeholder="Username"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editProfile.email}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Email"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editProfile.contactNumber}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          contactNumber: e.target.value,
                        }))
                      }
                      placeholder="Phone Number"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Business Information Section */}
            <div className="bg-gray-100 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                <Box className="mr-2 text-blue-600" size={20} />
                Business Details
              </h3>

              {!isEditing ? (
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Business Name</span>
                    <span className="font-medium">{profile.businessInfo.businessName || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Tax ID</span>
                    <span className="font-medium">{profile.businessInfo.taxId || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Address</span>
                    <span className="font-medium">{profile.businessInfo.address || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Bio</span>
                    <span className="font-medium">{profile.businessInfo.bio || "N/A"}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={editProfile.businessInfo.businessName}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          businessInfo: {
                            ...prev.businessInfo,
                            businessName: e.target.value,
                          },
                        }))
                      }
                      placeholder="Business Name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                    <input
                      type="text"
                      value={editProfile.businessInfo.taxId}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          businessInfo: {
                            ...prev.businessInfo,
                            taxId: e.target.value,
                          },
                        }))
                      }
                      placeholder="Tax ID"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                    <textarea
                      value={editProfile.businessInfo.address}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          businessInfo: {
                            ...prev.businessInfo,
                            address: e.target.value,
                          },
                        }))
                      }
                      placeholder="Business Address"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editProfile.businessInfo.bio}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          businessInfo: {
                            ...prev.businessInfo,
                            bio: e.target.value,
                          },
                        }))
                      }
                      placeholder="Short Bio"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      rows={3}
                    />
                  </div>
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
                  ${profile.verificationStatus.documentVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                    }
                `}
                >
                  {profile.verificationStatus.documentVerified
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
                  ${profile.verificationStatus.addressVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                    }
                `}
                >
                  {profile.verificationStatus.addressVerified
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
                  ${profile.verificationStatus.paymentVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                    }
                `}
                >
                  {profile.verificationStatus.paymentVerified
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


export default Profile;


