import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid: { // Add this field
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date

} , {timestamps: true});

// createdAt and updatedAt fields will be automatically added to documents throught timestamps:true
export const User = mongoose.model("User" , userSchema);