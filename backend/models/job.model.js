// backend/models/job.model.js
import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
    },
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
        default: 'Wishlist',
    },
    jobLink: {
        type: String,
        trim: true,
    },
    dateApplied: { type: Date },
    applyByDate: { type: Date },
    dateInterviewing: { type: Date }, 
    dateOffer: { type: Date }, 
    dateRejected: { type: Date },
    notes: {
        type: String,
        trim: true,
    },
    resumeUrl: {
        type: String,
    },
    resumePublicId: {
        type: String,
    },
    remindersEnabled: {
        type: Boolean,
        default: true // Default to true for a better "out-of-the-box" experience per job
    }
}, { timestamps: true });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);