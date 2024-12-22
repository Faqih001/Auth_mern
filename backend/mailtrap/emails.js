import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

// Send Verification Email function 
export const sendVerificationEmail = async (email, verificationToken) => {
	// recipient email address array with email address as object 
	const recipient = [{ email }];

	// try catch block for error handling
	try {
		// send email using mailtrapClient send method with email details
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

		// log success message to console
		console.log("Email sent successfully", response);
	} catch (error) {
		// log error message to console
		console.error(`Error sending verification`, error);

		// throw error message
		throw new Error(`Error sending verification email: ${error}`);
	}
};
// Send Welcome Email function
export const sendWelcomeEmail = async (email, name) => {
	// recipient email address array with email address as object
	const recipient = [{ email }];

	// try catch block for error handling
	try {
		// send email using mailtrapClient send method with email details
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df",
			template_variables: {
				company_info_name: "Auth Company",
				name: name,
			},
		});

		// log success message to console
		console.log("Welcome email sent successfully", response);
	} catch (error) {
		// log error message to console
		console.error(`Error sending welcome email`, error);

		// throw error message
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

// Send Password Reset Email function
export const sendPasswordResetEmail = async (email, resetURL) => {
	// recipient email address array with email address as object
	const recipient = [{ email }];

	// try catch block for error handling
	try {
		// send email using mailtrapClient send method with email details
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		// log error message to console
		console.error(`Error sending password reset email`, error);

		// throw error message
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
