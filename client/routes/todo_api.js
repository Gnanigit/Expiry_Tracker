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
    throw error;
  }
};

export const getAllTodos = async (token) => {
  try {
    if (!token) {
      token = await getAuthToken();
    }

    const response = await axios.get(`${baseURL}/todos/all-todos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

export const deleteTodo = async (todoIds) => {
  try {
    const token = await getAuthToken();
    const response = await axios.delete(`${baseURL}/todos/delete`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { todoIds },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting todos:", error);
    throw error;
  }
};
