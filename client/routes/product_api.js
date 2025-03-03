import axios from "axios";
import * as FileSystem from "expo-file-system";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;

// Helper function to get token from AsyncStorage
const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

export const getProductName = async (code) => {
  console.log(code);
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${baseURL}/product/prod-name`, {
      params: { code },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      console.log("getting product name");
      return response.data;
    } else {
      throw new Error("No response data from the server");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch product name"
    );
  }
};

export const createProduct = async (productData) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(
      `${baseURL}/product/create-product`,
      productData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error("No response data from the server");
    }
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

export const getAllProducts = async (token) => {
  try {
    if (!token) {
      token = await getAuthToken();
    }
    console.log("getAllProduct");
    const response = await axios.get(`${baseURL}/product/getAllProducts`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getAllProduct");
    if (response.data) {
      return response.data;
    } else {
      throw new Error("No response data from the server");
    }
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

export const uploadImageForProcessing = async (imageUri) => {
  try {
    // console.log("Original Image URI:", imageUri);
    const token = await getAuthToken();

    // Resize & compress the image using Expo Image Manipulator
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 600, height: 600 } }], // Resize to max 600x600
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Reduce quality to 70%
    );

    // Convert resized image to Base64
    const base64Image = await FileSystem.readAsStringAsync(
      manipulatedImage.uri,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    const response = await axios.post(
      `${baseURL}/product/process-image`,
      { image: base64Image }, // Send Base64 image to backend
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.expiryDate;
  } catch (error) {
    console.error("Error in uploadImageForProcessing:", error.message);
    throw new Error("Failed to process image");
  }
};

export const deleteProductById = async (productId) => {
  try {
    const token = await getAuthToken();
    const response = await axios.delete(`${baseURL}/product/delete-product`, {
      params: { productId },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in deleteProductById:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};

export const searchProducts = async (query) => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${baseURL}/product/search-products`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const priceComparison = async (prodName) => {
  console.log(`Price comparison`);
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${baseURL}/product/price-comparison`, {
      params: { prodName },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

const convertAudioToBase64 = async (audioUri) => {
  try {
    console.log("Converting audio to Base64:", audioUri);

    // Read audio file and convert to Base64
    const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return base64Audio;
  } catch (error) {
    console.error("Error converting audio to Base64:", error);
    return null;
  }
};

// Upload audio to server
export const getSpeechToText = async (audioUri) => {
  try {
    console.log("Uploading audio file:", audioUri);

    const base64Audio = await convertAudioToBase64(audioUri);
    if (!base64Audio) {
      return "Error converting audio to Base64";
    }

    const response = await axios.post(
      `${baseURL}/product/speech-to-text`,
      {
        audioBase64: base64Audio,
        format: "wav", // Ensure backend knows it's WAV
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Server response:", response.data);
    return response.data.text || "No text recognized";
  } catch (error) {
    console.error(
      "Error uploading audio:",
      error.response?.data || error.message
    );
    return "Error processing speech";
  }
};
