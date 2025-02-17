import express from "express";
import { addNotification, getAllNotifications } from "../controllers/notify.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const notifyRouter = express.Router();

notifyRouter.post("/add", authenticateUser, addNotification);

notifyRouter.get("/get-all-notifies", authenticateUser, getAllNotifications);

export default notifyRouter;
