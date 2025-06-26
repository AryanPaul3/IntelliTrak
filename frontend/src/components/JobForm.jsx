import { useState } from 'react';
import { useJobStore } from '../store/jobStore'; 
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const JobForm = ({ onSubmit, initialData = {}, isSubmitting, onCancel }) => {
    const { deleteResume } = useJobStore(); 
    const formatDateForInput = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
    const [formData, setFormData] = useState({
        // Spread initialData to get all fields, including _id and resumeUrl
        ...initialData, 
        // Then, format the dates specifically for the input elements
        company: initialData.company || '',
        jobTitle: initialData.jobTitle || '',
        status: initialData.status || 'Wishlist',
        jobLink: initialData.jobLink || '',
        notes: initialData.notes || '',
        applyByDate: formatDateForInput(initialData.applyByDate),
        dateApplied: formatDateForInput(initialData.dateApplied),
        dateInterviewing: formatDateForInput(initialData.dateInterviewing),
        dateOffer: formatDateForInput(initialData.dateOffer),
        dateRejected: formatDateForInput(initialData.dateRejected),
    });
    const [resumeFile, setResumeFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            const today = formatDateForInput(new Date());
            const updatedForm = { ...formData, [name]: value };
            // if (value === 'Applied' && !updatedForm.dateApplied) updatedForm.dateApplied = today;
            // if (value === 'Interviewing' && !updatedForm.dateInterviewing) updatedForm.dateInterviewing = today;
            // if (value === 'Offer' && !updatedForm.dateOffer) updatedForm.dateOffer = today;
            // if (value === 'Rejected' && !updatedForm.dateRejected) updatedForm.dateRejected = today;
            setFormData(updatedForm);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prepare data for submission, removing empty dates
        const submissionData = { ...formData };
        Object.keys(submissionData).forEach(key => {
            if (key.startsWith('date') && !submissionData[key]) {
                delete submissionData[key];
            }
        });
        onSubmit(submissionData , resumeFile);
    };

    const handleDeleteResume = async () => {
        if (!formData?._id) return; // Can't delete if it's a new, unsaved job
        
        if (window.confirm("Are you sure you want to remove the attached resume?")) {
            try {
                const updatedJob = await deleteResume(formData._id);
                // Directly update formData with the result from the server.
                // This is the key to keeping the UI in sync.
                setFormData(() => ({
                    ...updatedJob, // Overwrite with fresh data from DB (resumeUrl is now null)
                    // Re-format dates after overwriting
                    applyByDate: formatDateForInput(updatedJob.applyByDate),
                    dateApplied: formatDateForInput(updatedJob.dateApplied),
                    dateInterviewing: formatDateForInput(updatedJob.dateInterviewing),
                    dateOffer: formatDateForInput(updatedJob.dateOffer),
                    dateRejected: formatDateForInput(updatedJob.dateRejected),
                }));
                // console.log(await deleteResume(formData._id));
                // console.log(formData);

            } catch (error) {
                console.error("Failed to delete resume from form", error);
            }
        }
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
                
                {/* --- DYNAMIC DATE INPUTS --- */}
                {formData.status === 'Wishlist' && <Input label="Apply By" name="applyByDate" type="date" value={formData.applyByDate} onChange={handleChange} />}
                {formData.status === 'Applied' && <Input label="Date Applied" name="dateApplied" type="date" value={formData.dateApplied} onChange={handleChange} />}
                {formData.status === 'Interviewing' && <Input label="First Interview Date" name="dateInterviewing" type="date" value={formData.dateInterviewing} onChange={handleChange} />}
                {formData.status === 'Offer' && <Input label="Offer Date" name="dateOffer" type="date" value={formData.dateOffer} onChange={handleChange} />}
                {formData.status === 'Rejected' && <Input label="Rejected Date" name="dateRejected" type="date" value={formData.dateRejected} onChange={handleChange} />}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Resume (PDF only)</label>
                {formData.resumeUrl ? (
                    <div className="flex items-center justify-between p-2 bg-zinc-700 rounded-md">
                        <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate pr-4">
                            View Current Resume
                        </a>
                        <button 
                            type="button" 
                            onClick={handleDeleteResume}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ) : (
                    <input 
                        type="file" 
                        name="resume" 
                        accept="application/pdf"
                        onChange={handleFileChange} 
                        className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" 
                    />
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
