import express from "express";
import { signUp, signIn, getCurrentUser, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

router.get("/current-user", getCurrentUser);
router.post("/logout", logout);
export default router;
