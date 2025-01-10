import axios from "axios";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";
const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;

export const getBarcodeNumber = async (image) => {
  try {
    const response = await axios.post(`${baseURL}/scan-barcode`, image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data) {
      console.log(response.data);
      return response.data;
    } else {
      throw new Error("No response data from the server");
    }
  } catch (error) {
    console.error("Error in getBarcodeNumber:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch barcode number"
    );
  }
};
