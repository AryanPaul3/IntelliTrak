import {APPLICATION_REMINDER_TEMPLATE, INTERVIEW_REMINDER_TEMPLATE } from './emailTemplates.js';
import {transporter} from './mail.config.js';
import dotenv from 'dotenv';
dotenv.config();

const formatDaysLeftText = (daysLeft) => {
    if (daysLeft === 0) return "today";
    if (daysLeft === 1) return "tomorrow";
    return `in ${daysLeft} days`;
};

export const sendApplicationReminderEmail = async (email, name, job, daysLeft) => {
    try {
        const whenText = formatDaysLeftText(daysLeft);
        const html = APPLICATION_REMINDER_TEMPLATE
            .replace("{name}", name)
            .replace("{jobTitle}", job.jobTitle)
            .replace("{company}", job.company)
            .replace("{when}", whenText);
        
        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: `Reminder: Application for ${job.jobTitle} due ${whenText}!`,
            html: html,
        });
    } catch (error) {
        console.error("Error sending application reminder:", error);
    }
};

export const sendInterviewReminderEmail = async (email, name, job, daysLeft) => {
    try {
        const whenText = formatDaysLeftText(daysLeft);
        const html = INTERVIEW_REMINDER_TEMPLATE
            .replace("{name}", name)
            .replace("{jobTitle}", job.jobTitle)
            .replace("{company}", job.company)
            .replace("{when}", whenText);

        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: `Reminder: Interview for ${job.jobTitle} is ${whenText}`,
            html: html,
        });
    } catch (error) {
        console.error("Error sending interview reminder:", error);
    }
};