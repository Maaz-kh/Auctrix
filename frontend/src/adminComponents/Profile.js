import React, { useState, useEffect } from "react";
import { getRequest, putRequest } from "../axios"; // Adjust the path
import { Camera, Edit, Save, User, Box, X } from "lucide-react";
import profileImage from "../images/profile.png";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile from the API
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest(
        "http://localhost:5000/api/admin/get-user-details"
      );
      setProfile(response.data);
      setEditProfile(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Unable to fetch profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save updated profile
  const saveProfile = async () => {
    try {
      const updatedProfile = await putRequest("http://localhost:5000/api/admin/update-user-details",
        editProfile
      );
      setProfile(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Cancel editing and revert changes
  const cancelEditing = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchProfile} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl p-8 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4">
            <div className="flex items-center max-w-4xl mx-auto">
              <div className="relative group">
                <img
                  src={profile.profileImage || profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <Camera size={24} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="ml-6 text-white flex-grow">
                <h1 className="text-3xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-blue-100">{profile.businessName}</p>
              </div>

              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Edit size={20} className="mr-2" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition"
                    >
                      <X size={20} className="mr-2 inline-block" /> Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      className="flex items-center px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                    >
                      <Save size={20} className="mr-2" /> Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <ProfileSection
                icon={User}
                title="Personal Information"
                fields={[
                  {
                    label: "First Name",
                    value: editProfile.firstName,
                    name: "firstName",
                    type: "text",
                  },
                  {
                    label: "Last Name",
                    value: editProfile.lastName,
                    name: "lastName",
                    type: "text",
                  },
                  {
                    label: "Email",
                    value: editProfile.email,
                    name: "email",
                    type: "email",
                    disabled: true,
                  },
                  {
                    label: "Phone Number",
                    value: editProfile.phone,
                    name: "phone",
                    type: "tel",
                  },
                ]}
                isEditing={isEditing}
                setEditProfile={setEditProfile}
              />

              <ProfileSection
                icon={Box}
                title="Business Details"
                fields={[
                  {
                    label: "Business Name",
                    value: editProfile.businessName,
                    name: "businessName",
                    type: "text",
                  },
                  {
                    label: "Address",
                    value: editProfile.address,
                    name: "address",
                    type: "textarea",
                  },
                  {
                    label: "Short Bio",
                    value: editProfile.bio,
                    name: "bio",
                    type: "textarea",
                  },
                ]}
                isEditing={isEditing}
                setEditProfile={setEditProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({ icon: Icon, title, fields, isEditing, setEditProfile }) => (
  <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <Icon className="mr-3 text-blue-600" size={24} />
      {title}
    </h2>
    {fields.map((field, index) => (
      <div key={index} className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
        {field.type === "textarea" ? (
          <textarea
            value={field.value || ""}
            disabled={!isEditing || field.disabled}
            onChange={(e) =>
              setEditProfile((prev) => ({
                ...prev,
                [field.name]: e.target.value,
              }))
            }
            className={`w-full p-2 border rounded-lg ${
              isEditing && !field.disabled
                ? "bg-white border-blue-300 focus:ring-2 focus:ring-blue-200"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            placeholder={field.label}
            rows={3}
          />
        ) : (
          <input
            type={field.type}
            value={field.value || ""}
            disabled={!isEditing || field.disabled}
            onChange={(e) =>
              setEditProfile((prev) => ({
                ...prev,
                [field.name]: e.target.value,
              }))
            }
            className={`w-full p-2 border rounded-lg ${
              isEditing && !field.disabled
                ? "bg-white border-blue-300 focus:ring-2 focus:ring-blue-200"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            placeholder={field.label}
          />
        )}
      </div>
    ))}
  </div>
);

export default Profile;