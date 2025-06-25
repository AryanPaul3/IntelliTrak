// frontend/src/store/jobStore.js
import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore'; // We need this to get the auth token
import toast from 'react-hot-toast';

const API_URL = import.meta.env.MODE === "development" ? 'http://localhost:5000/api' : "/api";

export const useJobStore = create((set, get) => ({
    jobs: [],
    isLoading: false,
    error: null,

    // Helper to get auth token
    getAuthHeader: async () => {
        const token = await useAuthStore.getState().user?.getIdToken();
        if (!token) {
            toast.error("Authentication error. Please log in again.");
            throw new Error("No auth token available");
        }
        return { 'Authorization': `Bearer ${token}` };
    },

    fetchJobs: async () => {
        set({ isLoading: true, error: null });
        try {
            const headers = await get().getAuthHeader();
            const response = await axios.get(`${API_URL}/jobs`, { headers });
            set({ jobs: response.data, isLoading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch jobs';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },

    addJob: async (jobData) => {
        set({ isLoading: true, error: null });
        try {
            const headers = await get().getAuthHeader();
            const response = await axios.post(`${API_URL}/jobs`, jobData, { headers });
            set((state) => ({
                jobs: [response.data, ...state.jobs],
                isLoading: false,
            }));
            toast.success('Job added successfully!');
            return response.data; // Return the new job
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add job';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    updateJob: async (jobId, updatedData) => {
        set({ isLoading: true, error: null });
        try {
            const headers = await get().getAuthHeader();
            const response = await axios.put(`${API_URL}/jobs/${jobId}`, updatedData, { headers });
            set((state) => ({
                jobs: state.jobs.map((job) =>
                    job._id === jobId ? response.data : job
                ),
                isLoading: false,
            }));
            toast.success('Job updated successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update job';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },

    deleteJob: async (jobId) => {
        set({ isLoading: true, error: null });
        try {
            const headers = await get().getAuthHeader();
            await axios.delete(`${API_URL}/jobs/${jobId}`, { headers });
            set((state) => ({
                jobs: state.jobs.filter((job) => job._id !== jobId),
                isLoading: false,
            }));
            toast.success('Job deleted successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete job';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },

    scrapeJob: async (url) => {
        // Note: this function doesn't set global loading state
        // as it's specific to the add-job-modal.
        try {
            toast.loading('Scraping job details...', { id: 'scrape-toast' });
            const headers = await get().getAuthHeader();
            const response = await axios.post(`${API_URL}/jobs/scrape`, { url }, { headers });
            toast.success('Details populated!', { id: 'scrape-toast' });
            return response.data; // Returns { jobTitle, company }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Scraping failed';
            toast.error(errorMessage, { id: 'scrape-toast' });
            throw error;
        }
    }
}));