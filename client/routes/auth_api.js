import axios from "axios";
import { setIsLogged, setUser } from "../redux/slices/auth";
import { clearProducts } from "../redux/slices/products";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";
const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;

export const signUp = async (email, password, username) => {
  try {
    const response = await axios.post(`${baseURL}/auth/sign-up`, {
      withCredentials: true,
      email,
      password,
      username,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${baseURL}/auth/current-user`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/auth/sign-in`, {
      withCredentials: true,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (dispatch) => {
  try {
    await axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });
    dispatch(setIsLogged(false));
    dispatch(setUser(null));
    dispatch(clearProducts());
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const updateUserDetails = async (formData) => {
  try {
    const response = await axios.put(
      `${baseURL}/auth/update-user-details`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
