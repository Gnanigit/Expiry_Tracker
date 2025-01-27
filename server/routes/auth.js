import express from "express";
import { signUp, signIn, getCurrentUser, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/logout", logout);

router.get("/current-user", getCurrentUser);

export default router;
