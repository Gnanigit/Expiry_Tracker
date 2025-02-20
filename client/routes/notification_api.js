import axios from "axios";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;

const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

export const storeNotification = async (
  productId,
  productName,
  leftDays,
  expDate,
  status,
  productImage
) => {
  try {
    console.log(productId, productName, leftDays);
    const token = await getAuthToken();
    const response = await axios.post(
      `${baseURL}/notify/add`,
      {
        productId,
        productImage,
        productName,
        leftDays,
        expDate,
        status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error storing notification:",
      error.response?.data || error.message
    );
  }
};

export const getAllNotifications = async (token) => {
  try {
    if (!token) {
      token = await getAuthToken();
    }
    const response = await axios.get(`${baseURL}/notify/get-all-notifies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Getting all notifications`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching notifications:",
      error.response?.data || error.message
    );
  }
};
