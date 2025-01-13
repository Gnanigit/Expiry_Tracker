import express from "express";
import { signUp, signIn, getCurrentUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

router.get("/current-user", getCurrentUser);

export default router;
