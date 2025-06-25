// frontend/src/components/JobForm.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const JobForm = ({ onSubmit, initialData = {}, isSubmitting, onCancel }) => {
    const [formData, setFormData] = useState({
        company: initialData.company || '',
        jobTitle: initialData.jobTitle || '',
        status: initialData.status || 'Wishlist',
        jobLink: initialData.jobLink || '',
        notes: initialData.notes || '',
        // Handle date formatting for input fields
        dateApplied: initialData.dateApplied ? new Date(initialData.dateApplied).toISOString().split('T')[0] : '',
        applyByDate: initialData.applyByDate ? new Date(initialData.applyByDate).toISOString().split('T')[0] : '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prepare data for submission, removing empty dates
        const submissionData = { ...formData };
        if (!submissionData.dateApplied) delete submissionData.dateApplied;
        if (!submissionData.applyByDate) delete submissionData.applyByDate;
        onSubmit(submissionData);
    };

    return (
        <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
                <Input label="Company" name="company" value={formData.company} onChange={handleChange} required />
            </div>

            <div className="mb-4">
                <Input label="Job Link" name="jobLink" type="url" value={formData.jobLink} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 bg-zinc-700 rounded mt-1">
                        <option value="Wishlist">Wishlist</option>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                
                {/* Conditionally show relevant date fields */}
                {formData.status === 'Wishlist' ? (
                    <Input label="Apply By" name="applyByDate" type="date" value={formData.applyByDate} onChange={handleChange} />
                ) : (
                    <Input label="Date Applied" name="dateApplied" type="date" value={formData.dateApplied} onChange={handleChange} />
                )}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" className="w-full p-2 bg-zinc-700 rounded mt-1"></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={onCancel} className="text-zinc-400 hover:text-white px-4 py-2 rounded">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-teal-500 px-6 py-2 rounded font-bold hover:bg-teal-600 disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "Save Job"}
                </button>
            </div>
        </motion.form>
    );
};

// Helper component for consistent styling
const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
        <input {...props} className="w-full p-2 bg-zinc-700 rounded mt-1" />
    </div>
);

export default JobForm;