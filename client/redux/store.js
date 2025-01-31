import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import productsReducer from "./slices/products";
import themeReducer from "./slices/theme";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    theme: themeReducer,
  },
});

export default store;
