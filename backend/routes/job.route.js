// backend/routes/job.route.js
import express from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { getJobs, addJob, updateJob, deleteJob , scrapeJobDetails , deleteResume } from '../controllers/job.controller.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// All these routes are protected
router.use(verifyFirebaseToken);

router.route('/')
    .get(getJobs)
    .post(upload.single('resume'), addJob);

router.route('/:id')
    .put(upload.single('resume'), updateJob)
    .delete(deleteJob);

router.delete('/:id/resume', deleteResume);

router.post('/scrape', scrapeJobDetails);

export default router;