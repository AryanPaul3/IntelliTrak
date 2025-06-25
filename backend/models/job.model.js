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
    dateApplied: {
        type: Date,
    },
    applyByDate: {
        type: Date,
    },
    notes: {
        type: String,
        trim: true,
    },
    // We will add fields for Cloudinary later
    resumeUrl: String,
    resumePublicId: String,
}, { timestamps: true });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);