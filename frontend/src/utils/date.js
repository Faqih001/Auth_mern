// Format date function for displaying date in a readable format
export const formatDate = (dateString) => {

	// If the date string is invalid, return 'Invalid Date'
	const date = new Date(dateString);
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
