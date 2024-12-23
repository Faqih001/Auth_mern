import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

// load environment variables from .env file
dotenv.config();

// create mailtrap client instance with endpoint and token
export const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_ENDPOINT,
	token: process.env.MAILTRAP_TOKEN,
});

// sender email and name
export const sender = {
	email: "mailtrap@demomailtrap.com",
	name: "Burak",
};
