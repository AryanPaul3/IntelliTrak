// frontend/src/utils/dateFormatter.js

/**
 * Gets the ordinal suffix for a given day of the month.
 * e.g., 1 -> "st", 2 -> "nd", 3 -> "rd", 4 -> "th"
 * @param {number} day - The day of the month (1-31)
 * @returns {string} The ordinal suffix.
 */
const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // for 11th, 12th, 13th
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
};

/**
 * Formats a date string into a "6th July 2025" format.
 * @param {string} dateString - The ISO date string from the database.
 * @returns {string} The formatted date string, or an empty string if the input is invalid.
 */
export const formatDateWithOrdinal = (dateString) => {
    if (!dateString) {
        return ''; // Return empty if no date is provided
    }

    try {
        const date = new Date(dateString);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date provided");
        }
        
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        // Return a fallback, maybe the original string or just empty
        return '';
    }
};