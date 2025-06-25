// frontend/src/components/AddJobModal.jsx
import { useState } from 'react';
import { useJobStore } from '../store/jobStore';
import JobForm from './JobForm';

const AddJobModal = ({ onClose }) => {
    const { addJob } = useJobStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddJob = async (formData) => {
        setIsSubmitting(true);
        try {
            await addJob(formData);
            onClose(); // Close modal on success
        } catch (err) {
            // Error is already handled by toast in the store
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-zinc-800 border border-zinc-700 p-8 rounded-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-teal-400">Add New Job Application</h2>
                <JobForm 
                    onSubmit={handleAddJob} 
                    isSubmitting={isSubmitting}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
};

export default AddJobModal;