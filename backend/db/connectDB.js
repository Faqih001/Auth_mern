import mongoose from "mongoose";

// Connect to MongoDB database function using mongoose
export const connectDB = async () => {
	// try catch block for error handling
	try {
		// connect to MongoDB database using mongoose
		console.log("mongo_uri: ", process.env.MONGO_URI);

		// await mongoose.connect(process.env.MONGO_URI);
		const conn = await mongoose.connect(process.env.MONGO_URI);

		// log connection host to console
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		// log error message to console and
		console.log("Error connection to MongoDB: ", error.message);
		process.exit(1); // 1 is failure, 0 status code is success
	}
};
