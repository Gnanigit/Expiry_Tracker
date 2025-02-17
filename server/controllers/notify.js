import Notification from "../models/notify.js";

export const addNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    const { productId, productImage, productName, leftDays, expDate, status } =
      req.body;
    console.log(productId, productImage, productName, leftDays);
    const newNotification = new Notification({
      userId,
      productId,
      productImage,
      productName,
      leftDays,
      expDate,
      status,
    });

    await newNotification.save();
    console.log(newNotification);

    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    console.error("Error saving notification:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching notifications for user:", userId);

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
