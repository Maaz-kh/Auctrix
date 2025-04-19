import axios from "axios";

// Function to get the access token
const getAccessToken = () => {
  return localStorage.getItem("accessToken") || ""; 
};

// Generic GET request
export const getRequest = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      params,
    });
    return response.data;
    
  } catch (error) {
    console.error("GET Request Error:", error);
    throw error;
  }
};

// Generic POST request
export const postRequest = async (url, data = {}) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("POST Request Error:", error);
    throw error;
  }
};

// Generic PUT request
export const putRequest = async (url, data = {}) => {

  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error("PUT Request Error:", error);
    throw error;
  }
};

// Generic DELETE request
export const deleteRequest = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("DELETE Request Error:", error);
    throw error;
  }
};

export const postFormData = async (url, data = {}) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("POST Request Error:", error);
    throw error;
  }
};

export default axios;
