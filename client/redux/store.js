import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import productsReducer from "./slices/products";
import themeReducer from "./slices/theme";
import notificationReducer from "./slices/notify";
import todoReducer from "./slices/todo";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    theme: themeReducer,
    notifications: notificationReducer,
    todo: todoReducer,
  },
});

export default store;
