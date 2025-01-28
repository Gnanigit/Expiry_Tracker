import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = [];
    },
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const { clearProducts, removeProduct, addProduct, setProducts } =
  productsSlice.actions;
export default productsSlice.reducer;
