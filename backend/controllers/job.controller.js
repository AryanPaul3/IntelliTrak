import { JobApplication } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import puppeteer from 'puppeteer';

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
        const { company, jobTitle, status, jobLink, notes, dateApplied } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) return res.status(404).json({ message: "User not found" });

        const newJob = new JobApplication({
            user: user._id,
            company,
            jobTitle,
            status,
            jobLink,
            notes,
            dateApplied
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
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

        const updatedJob = await JobApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedJob);
    } catch (error) {
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

        await job.deleteOne(); // Mongoose 7+ uses deleteOne()
        res.status(200).json({ message: 'Job application removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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