import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";

// Sign up user controller function 
export const signup = async (req, res) => {
	// initializing email, password, name from req.body
	const { email, password, name } = req.body;

	// try catch error handling for empty fields 
	try {
		// check if email, password, name are empty
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		// check if user already exists
		const userAlreadyExists = await User.findOne({ email });

		// Log userAlreadyExists
		console.log("userAlreadyExists", userAlreadyExists);

		// if user already exists, return error message
		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		// hash password using bcryptjs
		const hashedPassword = await bcryptjs.hash(password, 10);

		// generate verification token 
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		// create new user with email, password, name, verificationToken, verificationTokenExpiresAt
		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		// save user to database
		await user.save();

		// jwt token generation and cookie setting
		generateTokenAndSetCookie(res, user._id);

		// send verification email to user email
		await sendVerificationEmail(user.email, verificationToken);

		// return success message and user data
		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		// catch error and return error message
		res.status(400).json({ success: false, message: error.message });
	}
};

// Verify email controller function
export const verifyEmail = async (req, res) => {
	// get code from req.body
	const { code } = req.body;

	// try catch error handling for invalid or expired verification code
	try {
		// find user with verificationToken and verificationTokenExpiresAt
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		// if user not found, return error message
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		// update user isVerified, verificationToken, verificationTokenExpiresAt
		user.isVerified = true;

		// set verificationToken and verificationTokenExpiresAt to undefined
		user.verificationToken = undefined;

		// set verificationTokenExpiresAt to undefined
		user.verificationTokenExpiresAt = undefined;

		// save user to database
		await user.save();

		// send welcome email to user email
		await sendWelcomeEmail(user.email, user.name);

		// return success message and user data
		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		// catch error and return error message
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Login user controller function 
export const login = async (req, res) => {

	// get email and password from req.body
	const { email, password } = req.body;

	// try catch error handling for invalid credentials
	try {

		// find user with email and password 
		const user = await User.findOne({ email });

		// if user not found, return error message
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		// check if password is valid 
		const isPasswordValid = await bcryptjs.compare(password, user.password);

		// if password is not valid, return error message
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		// jwt token generation and cookie setting
		generateTokenAndSetCookie(res, user._id);

		// update lastLogin field of user
		user.lastLogin = new Date();
		await user.save();

		// return success message and user data
		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		// catch error and return error message
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Logout user controller function
export const logout = async (req, res) => {
	// clear token cookie 
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Forgot password controller function
export const forgotPassword = async (req, res) => {

	// get email from req.body
	const { email } = req.body;

	// try catch error handling for invalid email
	try {

		// find user with email
		const user = await User.findOne({ email });

		// if user not found, return error message
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token and reset token expires at 
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		// update resetPasswordToken and resetPasswordExpiresAt
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		// save user to database
		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		// return success message
		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Reset password controller function 
export const resetPassword = async (req, res) => {

	// try catch error handling for invalid or expired reset token
	try {
		// get token and password from req.params and req.body
		const { token } = req.params;
		const { password } = req.body;

		// find user with resetPasswordToken and resetPasswordExpiresAt
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		// if user not found, return error message
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password and resetPasswordToken, resetPasswordExpiresAt
		const hashedPassword = await bcryptjs.hash(password, 10);

		// update password, resetPasswordToken, resetPasswordExpiresAt
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		// send reset success email
		await sendResetSuccessEmail(user.email);

		// return success message
		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		// catch error and return error message
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Check auth controller function
export const checkAuth = async (req, res) => {
	// try catch error handling for user not found
	try {
		// find user by id and exclude password field
		const user = await User.findById(req.userId).select("-password");

		// if user not found, return error message
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// return success message and user data
		res.status(200).json({ success: true, user });
	} catch (error) {
		// catch error and return error message
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
