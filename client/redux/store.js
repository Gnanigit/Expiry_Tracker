import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import productsReducer from "./slices/products";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
});

export default store;
