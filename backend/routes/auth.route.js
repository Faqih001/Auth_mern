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

router.post("/login", login);

router.post("/logout", logout);


router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);


router.post("/reset-password/:token", resetPassword);

export default router;
