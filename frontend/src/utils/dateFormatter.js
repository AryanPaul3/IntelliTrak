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

/**
 * Calculates the days left until a deadline and provides display text.
 * @param {string} deadlineString - The ISO date string for the deadline.
 * @returns {{isMissed: boolean, displayText: string}} An object with deadline status.
 */
export const calculateDaysLeft = (deadlineString) => {
    if (!deadlineString) {
        return { isMissed: false, displayText: '' };
    }

    // Set 'today' to the beginning of the day for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(deadlineString);
    deadline.setHours(0, 0, 0, 0); // Also normalize deadline to the start of the day

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { isMissed: true, displayText: 'Deadline Passed' };
    }
    if (diffDays === 0) {
        return { isMissed: false, displayText: 'Today' };
    }
    if (diffDays === 1) {
        return { isMissed: false, displayText: 'Tomorrow' };
    }
    return { isMissed: false, displayText: `in ${diffDays} days` };
};

/**
 * Gets the most relevant date and label for a given job status.
 * @param {object} job - The job application object.
 * @returns {{label: string, date: Date | null}} An object with the relevant label and date.
 */
export const getRelevantDate = (job) => {
    if (!job) return { label: '', date: null };

    if (job.dateRejected) return { label: 'Closed On', date: job.dateRejected };
    if (job.dateOffer) return { label: 'Offer Received', date: job.dateOffer };
    if (job.dateInterviewing) return { label: 'Interview Date', date: job.dateInterviewing };
    if (job.dateApplied) return { label: 'Applied On', date: job.dateApplied };
    if (job.applyByDate) return { label: 'Apply By', date: job.applyByDate };
    
    // Fallback if no dates are set
    return { label: 'Created On', date: job.createdAt };
};