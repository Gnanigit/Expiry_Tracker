import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  loading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    markAsRead: (state, action) => {
      state.notifications = state.notifications.map((notification) =>
        notification._id === action.payload
          ? { ...notification, read: true }
          : notification
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.productId !== action.payload
      );
    },
    removeMultipleNotifications: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => !action.payload.includes(notification.productId)
      );
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  clearNotifications,
  setLoading,
  removeNotification,
  removeMultipleNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
