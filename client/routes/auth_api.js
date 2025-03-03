import axios from "axios";
import { setIsLogged, setUser } from "../redux/slices/auth";
import { clearProducts } from "../redux/slices/products";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";

const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;

// Helper function to get token from AsyncStorage
const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

export const signUp = async (email, password, username) => {
  try {
    const response = await axios.post(`${baseURL}/auth/sign-up`, {
      email,
      password,
      username,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (token = null) => {
  try {
    if (!token) {
      token = await getAuthToken();
    }
    console.log("getting current user");
    const response = await axios.get(`${baseURL}/auth/current-user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("getting current user");
    return response.data;
  } catch (error) {
    console.error("Auto-login error:", error);
    return null;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/auth/sign-in`, {
      email,
      password,
    });

    const { token, user, formattedProducts } = response.data;
    await AsyncStorage.setItem("authToken", token);
    return response.data;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
};

export const logout = async (dispatch) => {
  try {
    const token = await getAuthToken();
    await axios.post(
      `${baseURL}/auth/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await AsyncStorage.removeItem("authToken");
    dispatch(setIsLogged(false));
    dispatch(setUser(null));
    dispatch(clearProducts());
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const updateUserDetails = async (formData) => {
  try {
    const token = await getAuthToken();
    const response = await axios.put(
      `${baseURL}/auth/update-user-details`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async (
  firstName,
  lastName,
  email,
  picture,
  password,
  google = true
) => {
  try {
    console.log(`loginWithGoogle account`);
    const response = await axios.post(`${baseURL}/auth/google-login`, {
      firstName,
      lastName,
      email,
      picture,
      password,
      google,
    });
    console.log(`loginWith google`);
    const { token, user, formattedProducts } = response.data;

    await AsyncStorage.setItem("authToken", token);

    return response.data;
  } catch (error) {
    throw error;
  }
};
