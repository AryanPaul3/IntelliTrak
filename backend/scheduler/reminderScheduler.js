import cron from 'node-cron';
import { JobApplication } from '../models/job.model.js';
import { sendApplicationReminderEmail, sendInterviewReminderEmail } from '../NodeMailer/email.js';

const calculateDays = (targetDate) => {
    if (!targetDate) return -1; // Return -1 if date is null

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(targetDate);
    eventDate.setHours(0, 0, 0, 0);
    
    // Calculate the difference in milliseconds and convert to days
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const checkAndSendReminders = async () => {
    console.log('Running expanded daily reminder check...');

    // These are the intervals (in days) we want to send reminders for.
    const reminderIntervals = [0, 1, 2, 3, 4, 5];

    try {
        // 1. Find all jobs that could possibly need a reminder.
        // These are jobs with reminders enabled and are in a 'Wishlist' or 'Interviewing' state.
        const activeJobs = await JobApplication.find({
            remindersEnabled: true,
            status: { $in: ['Wishlist', 'Interviewing'] }
        }).populate('user');

        console.log(`Checking ${activeJobs.length} active jobs for reminders.`);

        // 2. Loop through each job and check its dates.
        for (const job of activeJobs) {
            if (!job.user) continue; // Skip if user is not populated for some reason

            // Check for Application Deadline Reminders
            if (job.status === 'Wishlist' && job.applyByDate) {
                const daysLeft = calculateDays(job.applyByDate);
                // Check if the number of days left is one of our target intervals
                if (reminderIntervals.includes(daysLeft)) {
                    console.log(`Sending application reminder (${daysLeft} days left) to ${job.user.email} for job ${job._id}`);
                    await sendApplicationReminderEmail(job.user.email, job.user.name, job, daysLeft);
                }
            }

            // Check for Interview Reminders
            if (job.status === 'Interviewing' && job.dateInterviewing) {
                const daysLeft = calculateDays(job.dateInterviewing);
                // Check if the number of days left is one of our target intervals
                if (reminderIntervals.includes(daysLeft)) {
                    console.log(`Sending interview reminder (${daysLeft} days left) to ${job.user.email} for job ${job._id}`);
                    await sendInterviewReminderEmail(job.user.email, job.user.name, job, daysLeft);
                }
            }
        }
    } catch (error) {
        console.error('Error during expanded reminder check:', error);
    }
};

// Schedule the task to run once every day at 9:00 AM server time
// Cron format: 'minute hour day-of-month month day-of-week'
export const startReminderScheduler = () => {
    cron.schedule('0 9 * * *', checkAndSendReminders, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Set to your target user's timezone or a common one
    });
};
