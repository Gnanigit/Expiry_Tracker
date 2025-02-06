import express from "express";
import {
  signUp,
  signIn,
  getCurrentUser,
  logout,
  updateUserDetails,
  loginWithGoogle,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/logout", logout);
router.post("/google-login", loginWithGoogle);

router.put("/update-user-details", updateUserDetails);

router.get("/current-user", getCurrentUser);

export default router;
