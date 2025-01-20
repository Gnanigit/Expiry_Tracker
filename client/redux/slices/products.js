import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts, deleteProductById } from "../../routes/product_api.js"; // Replace with your API call

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllProducts(); // API call

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      // Make the delete API call and return the product ID
      const response = await deleteProductById(id);
      return id; // Return the product ID for removal
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [], // Ensure this is initialized as an array
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = [];
    },
    // removeProduct: (state, action) => {
    //   // Filter out the item with the given ID
    //   state.items = state.items.filter((item) => item._id !== action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // Remove the item with the given ID from the state
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProducts, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
