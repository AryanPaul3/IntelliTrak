import { create } from 'zustand'
import axios from 'axios'
import { auth } from "../firebase";
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged, // The most important import!
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile, // To set the user's name
    GoogleAuthProvider,
    signInWithPopup 
} from "firebase/auth";
import toast from 'react-hot-toast';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const API_URL = import.meta.env.MODE === "development" ? 'http://localhost:5000/api' : "/api"; // Adjust the API URL based on the environment
axios.defaults.withCredentials = true; // Enable sending cookies with requests

export const useAuthStore = create((set , get) => ({
    user: null, // This will store the Firebase user object
    profile: null, // This will store custom data from your DB
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,   // Start as true until the first check is done
    message: null,
    theme: getInitialTheme(),

    initTheme: () => {
        const theme = get().theme;
        if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        } else {
        document.documentElement.classList.remove('dark');
        }
    },

    toggleTheme: () => {
        set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        return { theme: newTheme };
        });
    },

    initializeAuthListener: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in.
                set({ user: firebaseUser, isAuthenticated: true, isCheckingAuth: false });
                
                // OPTIONAL BUT RECOMMENDED: Fetch custom profile data from your own backend
                try {
                    const token = await firebaseUser.getIdToken();
                    const response = await axios.get(`${API_URL}/users/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    console.log("User: " , response.data)
                    set({ profile: response.data.profile });
                } catch (err) {
                    console.error("Could not fetch user profile.", err);
                }

            } else {
                // User is signed out.
                set({ user: null, profile: null, isAuthenticated: false, isCheckingAuth: false });
            }
        });
    },

    signInWithGoogle: async () => {
        set({ error: null });
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            // This is the crucial part. After a successful Google sign-in,
            // we must check if a profile for this user already exists in our own database.
            // If not, we create one. The backend endpoint will handle this logic.
            
            const token = await firebaseUser.getIdToken();
            
            // We'll create a new backend endpoint for this "find or create" logic.
            const response = await axios.post(`${API_URL}/users/auth/google`, 
                { 
                    name: firebaseUser.displayName, 
                    email: firebaseUser.email,
                    // You could also send firebaseUser.photoURL if you want to store it
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // The onAuthStateChanged listener will automatically update the `user` object.
            // We just need to set our custom `profile` from our DB.
            set({ profile: response.data.profile });
            
            toast.success("Successfully signed in with Google!");

        } catch (error) {
            // Handle common errors like "popup-closed-by-user" gracefully
            if (error.code !== 'auth/popup-closed-by-user') {
                set({ error: error.message || 'Google Sign-In failed', isLoading: false });
                toast.error(error.message || 'Google Sign-In failed');
            } else {
                set({ isLoading: false }); // Just stop loading, don't show an error
            }
            throw error;
        }
    },

    signup: async (email , password , name) => {
        set({ isLoading: true, error: null });
        try {
            const userCredential  = await createUserWithEmailAndPassword (auth, email, password);

            // Update Firebase profile with the name
            await updateProfile(userCredential.user, { displayName: name });
            console.log("User: " , userCredential)

            await sendEmailVerification(userCredential.user);
            toast.success("Verification mail is sent")

            // 3. IMPORTANT: Create the user profile in YOUR OWN database
            // We need to send the Firebase UID to our backend to link the accounts.
            const token = await userCredential.user.getIdToken();
            const response = await axios.post(`${API_URL}/users/create-profile`, 
                { name: name, email: email }, // Send necessary profile data
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // After successfully creating the profile on the backend,
            // immediately set it in the frontend state.
            set({profile: response.data.profile, isLoading: false });

        } catch (error) {
            set({ error: error.message || 'Signup failed', isLoading: false });
            throw error;
        }
    },
    
    login : async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            // Firebase handles everything. The onAuthStateChanged listener will update the state.
            await signInWithEmailAndPassword(auth, email, password);
            set({ isLoading: false });

        } catch (error) {
            set({ error: error.message || 'Login failed', isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            // Just sign out from Firebase. The onAuthStateChanged listener will clear the state.
            await signOut(auth);
            // No need to call a backend logout endpoint anymore.
            set({ isLoading: false });
        } catch (error) {
            set({ error: 'Logout failed', isLoading: false });
            throw error;
        }
    },

    
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null, message: null });
		try {
            // Use Firebase's built-in password reset
			await sendPasswordResetEmail(auth, email);
			set({ message: "Password reset email sent successfully!", isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.message || "Error sending reset password email",
			});
			throw error;
		}
    }

}));

// Initialize theme on app load
useAuthStore.getState().initTheme();