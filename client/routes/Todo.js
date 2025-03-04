import axios from "axios";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";
const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

export const todo = async (todoItems) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(
      `${baseURL}/todos/create-todo`,
      todoItems,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving todos:", error);
    throw error; // Throw error so the calling function can handle it
  }
};
