import { JobApplication } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import puppeteer from 'puppeteer';
import cloudinary from '../config/cloudinary.js';


const uploadFromBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const safeFilename = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: "intelli-trak-resumes",
                // Provide a unique public_id to prevent any naming conflicts
                public_id: `${Date.now()}-${safeFilename}`
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );
        // End the stream with the file's buffer to start the upload.
        uploadStream.end(file.buffer);
    });
};

// @desc    Get all job applications for a user
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) return res.status(404).json({ message: "User not found" });

        const jobs = await JobApplication.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



// @desc    Create a new job application
// @route   POST /api/jobs
export const addJob = async (req, res) => {
    try {
        const { company, jobTitle, status, jobLink, notes, dateApplied, applyByDate } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) return res.status(404).json({ message: "User not found" });

        const newJobData = {
            user: user._id,
            company, jobTitle, status, jobLink, notes, dateApplied, applyByDate
        };

        if (!newJobData.dateApplied) delete newJobData.dateApplied;
        if (!newJobData.applyByDate) delete newJobData.applyByDate;

        // If a file is uploaded, upload it to Cloudinary
        if (req.file) {
            const result = await uploadFromBuffer(req.file);
            newJobData.resumeUrl = result.secure_url;
            newJobData.resumePublicId = result.public_id;
        }

        const newJob = new JobApplication(newJobData);
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error("Add Job Error:", error);
        res.status(400).json({ message: 'Error adding job', error: error.message });
    }
};

// @desc    Update a job application
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res) => {
    try {
        const job = await JobApplication.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job application not found" });

        // Authorization check: ensure the job belongs to the logged-in user
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (job.user.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const updatedData = { ...req.body };

        if (!updatedData.dateApplied) delete updatedData.dateApplied;
        if (!updatedData.applyByDate) delete updatedData.applyByDate;

        if (req.file) {
            if (job.resumePublicId) {
                try { await cloudinary.uploader.destroy(job.resumePublicId); }
                catch (e) { console.error("Could not delete old resume, continuing...", e); }
            }
            
            const result = await uploadFromBuffer(req.file);
            updatedData.resumeUrl = result.secure_url;
            updatedData.resumePublicId = result.public_id;
        }
        const updatedJob = await JobApplication.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json(updatedJob);

    } catch (error) {
        console.error("Update Job Error:", error);
        res.status(400).json({ message: 'Error updating job', error: error.message });
    }
};

// @desc    Delete a job application
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
    try {
        const job = await JobApplication.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job application not found" });

        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (job.user.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (job.resumePublicId) {
            try { await cloudinary.uploader.destroy(job.resumePublicId); }
            catch (e) { console.error("Could not delete resume, continuing...", e); }
        }

        await job.deleteOne(); // Mongoose 7+ uses deleteOne()
        res.status(200).json({ message: 'Job application removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a resume from a job application
// @route   DELETE /api/jobs/:id/resume
export const deleteResume = async (req, res) => {
    try {
        const job = await JobApplication.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job application not found" });
        }

        // Authorization check
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (job.user.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // Check if there's a resume to delete
        if (job.resumePublicId) {
            // Delete from Cloudinary
            await cloudinary.uploader.destroy(job.resumePublicId, { resource_type: 'raw' });

            // Remove from our database record and save
            job.resumeUrl = undefined;
            job.resumePublicId = undefined;
            const updatedJob = await job.save();

            // Return the updated job object
            res.status(200).json(updatedJob);
        } else {
            // If no resume exists, just return the job as is
            res.status(200).json(job);
        }

    } catch (error) {
        console.error("Delete Resume Error:", error);
        res.status(500).json({ message: 'Error deleting resume', error: error.message });
    }
};

// @desc    Scrape job details from a URL
// @route   POST /api/jobs/scrape
export const scrapeJobDetails = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true, // Use true in production
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necessary for many hosting environments
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // NOTE: These selectors are EXAMPLES and are highly likely to break.
        // You MUST inspect the job sites (LinkedIn, Indeed, etc.) you want to support
        // and find the correct, most stable selectors.
        const jobDetails = await page.evaluate(() => {
            const titleElement = document.querySelector('h1.top-card-layout__title, h1.jobsearch-JobInfoHeader-title');
            const companyElement = document.querySelector('a.topcard__org-name-link, a.jobsearch-CompanyInfo-name');

            const jobTitle = titleElement ? titleElement.innerText.trim() : '';
            const company = companyElement ? companyElement.innerText.trim() : '';

            return { jobTitle, company };
        });

        res.status(200).json(jobDetails);

    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ message: 'Failed to scrape job details', error: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};