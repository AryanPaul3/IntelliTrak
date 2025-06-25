import express from  "express";
import { createProfile, getProfile } from "../controllers/user.controller.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get('/profile', verifyFirebaseToken, getProfile);
router.post('/create-profile', verifyFirebaseToken, createProfile);


export default router;