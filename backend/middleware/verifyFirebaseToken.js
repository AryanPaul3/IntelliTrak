import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();
// import serviceAccount from '../serviceAccountKey.json' assert { type: "json" };
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    console.log("Initializing Firebase Admin from Base64 environment variable (Production Mode).");
    // Decode the Base64 string back into a standard JSON string
    const decodedString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    // Parse the string into a usable JavaScript object
    serviceAccount = JSON.parse(decodedString);
} else {
    // If the environment variable is not found, it falls back to the local file (Development Mode).
    try {
        console.log("Initializing Firebase Admin from local serviceAccountKey.json file (Development Mode).");
        // We use a dynamic import() because it won't crash the server if the file is missing during a build process.
        const serviceAccountModule = await import('../serviceAccountKey.json', { assert: { type: 'json' } });
        serviceAccount = serviceAccountModule.default;
    } catch (error) {
        console.error("FATAL ERROR: Could not initialize Firebase Admin SDK.");
        console.error("For local development, ensure 'serviceAccountKey.json' exists in the 'backend' directory.");
        console.error("For production, ensure the 'FIREBASE_SERVICE_ACCOUNT_BASE64' environment variable is set.");
        process.exit(1); // Exit the process if no credentials can be found
    }
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized successfully.");
}

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // verifyIdToken checks the signature and expiration of the token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach the decoded token to the request object
    // It contains uid, email, etc.
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
};