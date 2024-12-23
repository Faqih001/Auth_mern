import jwt from "jsonwebtoken";

// Middleware to verify token and check if user is authenticated
export const verifyToken = (req, res, next) => {
	// Get token from cookies in request object header
	const token = req.cookies.token;

	// If no token is found, return error response
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });

	// Try to verify token using JWT_SECRET from environment variables
	try {

		// Decode token and get userId from payload
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// If token is invalid, return error response with message
		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		// Set userId in request object to decoded userId
		req.userId = decoded.userId;

		// Call next middleware
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};
