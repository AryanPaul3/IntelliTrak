import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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