import jwt from "jsonwebtoken";

// Generate JWT token and set cookie with token in response
export const generateTokenAndSetCookie = (res, userId) => {
	// Generate JWT token with user ID and secret
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	// Set cookie with token in response
	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};
