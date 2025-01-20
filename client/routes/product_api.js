import axios from "axios";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";
const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;

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
  try {
    const response = await axios.get(`${baseURL}/product/prod-name`, {
      params: { code },
      headers: {
        "Content-Type": "application/json",
      },
    });

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

export const deleteProductById = async (productId) => {
  try {
    const response = await axios.delete(`${baseURL}/product/delete-product`, {
      params: { productId },
      headers: {
        "Content-Type": "application/json",
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
