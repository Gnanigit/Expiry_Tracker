import { createSlice } from "@reduxjs/toolkit";

// Initial state for the authentication
const initialState = {
  isLogged: false,
  user: null,
  loading: true,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setIsLogged, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
