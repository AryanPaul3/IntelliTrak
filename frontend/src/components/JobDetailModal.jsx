import { useState } from 'react';
import { useJobStore } from '../store/jobStore';
import JobForm from './JobForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, Link as LinkIcon, FileText, X, Edit, Trash2 , Paperclip} from 'lucide-react';
import { formatDateWithOrdinal , calculateDaysLeft , getRelevantDate } from '../utils/dateFormatter';
import Timeline from './Timeline';
import { Switch } from '@headlessui/react'
import toast from 'react-hot-toast'; 

const JobDetailModal = ({ job, onClose }) => {
    const { updateJob, deleteJob } = useJobStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Create a local state for the job to provide instant UI feedback
    const [currentJob, setCurrentJob] = useState(job);

    const handleReminderToggle = async (checked) => {
        // Provide instant optimistic UI update
        setCurrentJob(prev => ({ ...prev, remindersEnabled: checked }));

        try {
            // Call the existing updateJob function with only the field that changed
            await updateJob(currentJob._id, { remindersEnabled: checked } , null , { silent: true });
            toast.success("Reminder settings saved!");
        } catch (error) {
            // If the API call fails, revert the UI and show an error
            toast.error("Failed to save settings.");
            setCurrentJob(prev => ({ ...prev, remindersEnabled: !checked }));
        }
    };

    const handleUpdate = async (formData , resumeFile) => {
        setIsSubmitting(true);
        try {
            await updateJob(job._id, formData , resumeFile);
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

    // We will render the toggle only if it's relevant
    const showReminderToggle = currentJob.status === 'Wishlist' || currentJob.status === 'Interviewing';
    
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
                                key={`${currentJob._id}-${currentJob.resumeUrl}`}
                                initialData={currentJob}
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

                                {(() => {
                                    const { label, date } = getRelevantDate(job);
                                    if (date) {
                                        return (
                                            <DetailItem icon={<Calendar size={20} />} label={label}>
                                                {formatDateWithOrdinal(date)}
                                                {/* Add the countdown text specifically for Wishlist status */}
                                                {job.status === 'Wishlist' && job.applyByDate && (
                                                    <span className="ml-2 font-semibold text-yellow-400">
                                                        ({calculateDaysLeft(job.applyByDate).displayText})
                                                    </span>
                                                )}
                                                {job.status === 'Interviewing' && job.dateInterviewing && (
                                                    <span className="ml-2 font-semibold text-yellow-400">
                                                        ({calculateDaysLeft(job.dateInterviewing).displayText})
                                                    </span>
                                                )}
                                            </DetailItem>
                                        );
                                    }
                                    return null;
                                })()}

                                {job.jobLink && (
                                    <DetailItem icon={<LinkIcon size={20} />} label="Job Link">
                                        <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline break-all">
                                            {job.jobLink}
                                        </a>
                                    </DetailItem>
                                )}
                                {job.resumeUrl && (
                                    <DetailItem icon={<Paperclip size={20} />} label="Attached Resume">
                                        <a href={job.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                            View Resume
                                        </a>
                                    </DetailItem>
                                )}
                                {job.notes && (
                                    <DetailItem icon={<FileText size={20} />} label="Notes">
                                        <p className="whitespace-pre-wrap">{job.notes}</p>
                                    </DetailItem>
                                )}
                            </div>

                            <Timeline job={job} />

                            {/* --- ADD THE PER-JOB REMINDER TOGGLE --- */}
                            {showReminderToggle && (
                                <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-zinc-100">Get Email Reminders</h4>
                                            <p className="text-sm text-zinc-400">We'll notify you the day before the deadline or interview.</p>
                                        </div>
                                        <Switch
                                            checked={currentJob.remindersEnabled}
                                            onChange={handleReminderToggle}
                                            className={`${
                                                currentJob.remindersEnabled ? 'bg-teal-600' : 'bg-zinc-600'
                                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                        >
                                            <span className={`${
                                                currentJob.remindersEnabled ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                            />
                                        </Switch>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex justify-end items-center gap-4 pt-4 mt-6 border-t border-zinc-700">
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