import axios from "axios";
import * as FileSystem from "expo-file-system";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";
const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;
import * as ImageManipulator from "expo-image-manipulator";

// export const getBarcodeNumber = async (image) => {
//   try {
//     const response = await axios.post(
//       `${baseURL}/product/scan-barcode`,
//       image,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     if (response.data) {
//       return response.data;
//     } else {
//       throw new Error("No response data from the server");
//     }
//   } catch (error) {
//     console.error("Error in getBarcodeNumber:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to fetch barcode number"
//     );
//   }
// };

export const getProductName = async (code) => {
  console.log(code);
  try {
    const response = await axios.get(`${baseURL}/product/prod-name`, {
      params: { code },
      headers: {
        "Content-Type": "application/json",
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
    const response = await axios.post(
      `${baseURL}/product/create-product`,
      productData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.data) {
      return response.data;
    } else {
      throw new Error("No response data from the server");
    }
  } catch (error) {
    console.error("Error in getProductName:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product name"
    );
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${baseURL}/product/getAllProducts`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("getting all products");
    if (response.data) {
      return response.data;
    } else {
      throw new Error("No response data from the server");
    }
  } catch (error) {
    console.error("Error in getProductName:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product name"
    );
  }
};

export const uploadImageForProcessing = async (imageUri) => {
  try {
    console.log("Original Image URI:", imageUri);

    // Resize & compress the image using Expo Image Manipulator
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 600, height: 600 } }], // Resize to max 800x800
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Reduce quality to 70%
    );

    // console.log("Resized Image URI:", manipulatedImage.uri);

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
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    // console.log("Image processing response:", response.data);
    return response.data.expiryDate; // Expected response: Extracted expiry date
  } catch (error) {
    console.error("Error in uploadImageForProcessing:", error.message);
    throw new Error("Failed to process image");
  }
};

export const deleteProductById = async (productId) => {
  try {
    const response = await axios.delete(`${baseURL}/product/delete-product`, {
      params: { productId },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
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
    const response = await axios.get(`${baseURL}/product/search-products`, {
      params: { query },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const priceComparison = async (prodName) => {
  console.log(`Price comparison`);
  try {
    const response = await axios.get(`${baseURL}/product/price-comparison`, {
      params: { prodName },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
