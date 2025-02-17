import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productImage: String,
  productName: String,
  leftDays: Number,
  expDate: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
