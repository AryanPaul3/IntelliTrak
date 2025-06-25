// frontend/src/components/JobDetailModal.jsx
import { useState } from 'react';
import { useJobStore } from '../store/jobStore';
import JobForm from './JobForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, Link as LinkIcon, FileText, X, Edit, Trash2 } from 'lucide-react';
import { formatDateWithOrdinal } from '../utils/dateFormatter';

const JobDetailModal = ({ job, onClose }) => {
    const { updateJob, deleteJob } = useJobStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async (formData) => {
        setIsSubmitting(true);
        try {
            await updateJob(job._id, formData);
            onClose(); // Close modal after successful update
        } catch (error) {
            // Error toast is shown in store
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this job application? This action cannot be undone.")) {
            await deleteJob(job._id);
            onClose();
        }
    };
    
    // Helper for displaying details
    const DetailItem = ({ icon, label, children }) => (
        <div className="flex items-start mb-3">
            <div className="text-teal-400 mt-1 mr-3">{icon}</div>
            <div>
                <p className="text-xs text-zinc-400">{label}</p>
                <div className="text-zinc-100">{children}</div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-teal-400">Job Details</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-700">
                        <X size={24} />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        // EDITING MODE
                        <motion.div key="edit">
                            <JobForm
                                initialData={job}
                                onSubmit={handleUpdate}
                                isSubmitting={isSubmitting}
                                onCancel={() => setIsEditing(false)}
                            />
                        </motion.div>
                    ) : (
                        // VIEWING MODE
                        <motion.div key="view">
                             <div className="space-y-4 mb-6">
                                <DetailItem icon={<Briefcase size={20} />} label="Job Title / Company">
                                    {job.jobTitle} at <strong>{job.company}</strong>
                                </DetailItem>
                                <DetailItem icon={<FileText size={20} />} label="Status">
                                    {job.status}
                                </DetailItem>

                                {job.status === 'Wishlist' && job.applyByDate && (
                                    <DetailItem icon={<Calendar size={20} />} label="Apply By Date">
                                        {formatDateWithOrdinal(job.applyByDate)}
                                    </DetailItem>
                                )}
                                {job.status !== 'Wishlist' && job.dateApplied && (
                                     <DetailItem icon={<Calendar size={20} />} label="Date Applied">
                                        {formatDateWithOrdinal(job.dateApplied)}
                                    </DetailItem>
                                )}

                                {job.jobLink && (
                                    <DetailItem icon={<LinkIcon size={20} />} label="Job Link">
                                        <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline break-all">
                                            {job.jobLink}
                                        </a>
                                    </DetailItem>
                                )}
                                {job.notes && (
                                    <DetailItem icon={<FileText size={20} />} label="Notes">
                                        <p className="whitespace-pre-wrap">{job.notes}</p>
                                    </DetailItem>
                                )}
                            </div>
                            
                            <div className="flex justify-end items-center gap-4 pt-4 border-t border-zinc-700">
                                <button onClick={handleDelete} className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-500/10">
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button onClick={() => setIsEditing(true)} className="bg-teal-500 hover:bg-teal-600 font-bold flex items-center gap-2 px-4 py-2 rounded-md">
                                    <Edit size={16} /> Update
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default JobDetailModal;