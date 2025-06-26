import { User } from "../models/user.model.js";

// This controller is triggered AFTER a user signs up on the frontend with Firebase
export const createProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        // The firebase UID comes from our verifyFirebaseToken middleware
        const firebaseUid = req.user.uid;

        console.log(firebaseUid)

        const existingUser = await User.findOne({ firebaseUid });
        if (existingUser) {
            return res.status(400).json({ message: "User profile already exists." });
        }

        // We no longer store password here!
        const newProfile = new User({
            firebaseUid: firebaseUid,
            name: name,
            email: email,
            // You can add any other custom fields here (e.g., role, bio)
        });

        await newProfile.save();

        res.status(201).json({
            message: "User profile created successfully",
            profile: newProfile,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error creating profile", error: error.message });
    }
};

// This controller gets the user profile from our DB
export const getProfile = async (req, res) => {
    try {
        // Find user in our DB using the UID from the verified Firebase token
        const profile = await User.findOne({ firebaseUid: req.user.uid }) // Ensure password is never sent

        if (!profile) {
            return res.status(404).json({ message: "User profile not found." });
        }

        res.status(200).json({ profile });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching profile", error: error.message });
    }
};

// @desc    Authenticate/Register user with Google
// @route   POST /api/users/auth/google
export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        const firebaseUid = req.user.uid; // From verifyFirebaseToken middleware

        // "Upsert" logic: Find a user with this Firebase UID.
        let userProfile = await User.findOne({ firebaseUid: firebaseUid });

        // If the user does NOT exist, create them.
        if (!userProfile) {
            console.log(`Creating new profile for Google user: ${email}`);
            userProfile = new User({
                firebaseUid: firebaseUid,
                name: name,
                email: email,
                // You can add photoURL here if you decide to store it
            });
            await userProfile.save();
        }

        // If the user already existed, we've successfully found them.
        // Either way, we now have a userProfile to send back.
        res.status(200).json({
            message: "User authenticated successfully",
            profile: userProfile,
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Server error during Google authentication", error: error.message });
    }
};