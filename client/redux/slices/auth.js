import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  user: null,
  authLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    initializeAuth: (state, action) => {
      const { isLogged, user } = action.payload;
      state.isLogged = isLogged;
      state.user = user;
      state.authLoading = false;
    },
  },
});

export const { setIsLogged, setUser, setAuthLoading, initializeAuth } =
  authSlice.actions;
export default authSlice.reducer;
