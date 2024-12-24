import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

// Create express router instance
const router = express.Router();

// Define routes for auth endpoints with corresponding controller functions
router.get("/check-auth", verifyToken, checkAuth);

// Define routes for login endpoints with corresponding controller functions 
router.post("/signup", signup);
// Define routes for login endpoints with corresponding controller functions
router.post("/login", login);
// Define routes for logout endpoints with corresponding controller functions
router.post("/logout", logout);

// Define routes for verify email endpoints with corresponding controller functions
router.post("/verify-email", verifyEmail);
// Define routes for forgot password endpoints with corresponding controller functions
router.post("/forgot-password", forgotPassword);
// Define routes for reset password endpoints with corresponding controller functions
router.post("/reset-password/:token", resetPassword);

export default router;
