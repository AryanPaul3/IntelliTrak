// backend/routes/job.route.js
import express from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { getJobs, addJob, updateJob, deleteJob , scrapeJobDetails } from '../controllers/job.controller.js';

const router = express.Router();

// All these routes are protected
router.use(verifyFirebaseToken);

router.route('/')
    .get(getJobs)
    .post(addJob);

router.route('/:id')
    .put(updateJob)
    .delete(deleteJob);

router.post('/scrape', scrapeJobDetails);

export default router;