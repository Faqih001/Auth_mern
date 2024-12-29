// Format date function for displaying date in a readable format
export const formatDate = (dateString) => {

	// Convert the date string to a Date object
	const date = new Date(dateString);

	// If the date string is invalid, return 'Invalid Date'
	if (isNaN(date.getTime())) {
		return "Invalid Date";
	}

	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};
