import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [], // Stores all notifications
  loading: false, // Loading state for fetching notifications
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload; // Set all notifications from backend
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
      state.notifications = []; // Remove all notifications
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.productId !== action.payload
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
} = notificationSlice.actions;

export default notificationSlice.reducer;
