import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

// load environment variables from .env file
dotenv.config();

// create express app
const app = express();

// middleware for parsing incoming requests
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// allow cross-origin requests from frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

// define routes for auth endpoints
app.use("/api/auth", authRoutes);

// serve frontend static files in production
if (process.env.NODE_ENV === "production") {
	// set static folder for frontend
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// serve index.html file for all routes
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});
