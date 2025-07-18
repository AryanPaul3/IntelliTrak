import { useEffect , useState , useMemo } from 'react';
import { useJobStore } from '../store/jobStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import AddJobModal from '../components/AddJobModal'; 
import JobDetailModal from '../components/JobDetailModal';
import { ExternalLink, Calendar, Plus, Filter , Paperclip } from 'lucide-react';
import { formatDateWithOrdinal , calculateDaysLeft , getRelevantDate } from '../utils/dateFormatter';

const Dashboard = () => {
    const { profile, logout } = useAuthStore();
    const { jobs, isLoading, fetchJobs } = useJobStore();
    const [isModalOpen, setIsModalOpen] = useState(false);    const [selectedJob, setSelectedJob] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        // Fetch jobs when the component mounts
        fetchJobs();
    }, [fetchJobs]);

    // Use useMemo to filter jobs only when the filter or the jobs list changes
    const sortedAndFilteredJobs  = useMemo(() => {
        // 1. Start with the initial filtering based on status
        const filtered = activeFilter === 'All'
            ? jobs
            : jobs.filter(job => job.status === activeFilter);
        
        // 2. Now, sort the filtered array
        return filtered.sort((jobA, jobB) => {
            // Get the primary date for each job
            const { date: dateA } = getRelevantDate(jobA);
            const { date: dateB } = getRelevantDate(jobB);

            // Handle cases where a job might not have a relevant date
            if (!dateA && !dateB) return 0; // If both are null, keep original order
            if (!dateA) return 1;           // Jobs with no date go to the bottom
            if (!dateB) return -1;          // Jobs with no date go to the bottom

            // Perform the date comparison (ascending order - smallest date first)
            return new Date(dateA) - new Date(dateB);
        });
    }, [jobs, activeFilter]);

    const filterOptions = ['All', 'Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

    const StatusBadge = ({ status }) => {
        const styles = {
            Wishlist: 'bg-purple-500/20 text-purple-300',
            Applied: 'bg-blue-500/20 text-blue-300',
            Interviewing: 'bg-yellow-500/20 text-yellow-300',
            Offer: 'bg-green-500/20 text-green-300',
            Rejected: 'bg-red-500/20 text-red-300'
        };
        return <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status]}`}>{status}</span>
    };

    

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8">
            {isModalOpen && <AddJobModal onClose={() => setIsModalOpen(false)} />}
            {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}

            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {profile?.name}!</h1>
                    <p className="text-zinc-400">Your Job Application Dashboard</p>
                </div>
                <button onClick={logout} className="bg-zinc-700 px-4 py-2 rounded-md hover:bg-zinc-600 transition">
                    Logout
                </button>
            </header>

            <main>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-semibold">Your Applications ({sortedAndFilteredJobs.length})</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-teal-500 w-full sm:w-auto px-4 py-2 rounded-md hover:bg-teal-600 transition font-semibold flex items-center justify-center gap-2">
                        <Plus size={18} /> Add New
                    </button>
                </div>

                {/* --- FILTER BAR --- */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    <Filter size={18} className="text-zinc-400 flex-shrink-0" />
                    {filterOptions.map(option => (
                        <button
                            key={option}
                            onClick={() => setActiveFilter(option)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex-shrink-0 ${
                                activeFilter === option 
                                ? 'bg-teal-500 text-white' 
                                : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                
                {isLoading && jobs.length === 0 ? <LoadingSpinner /> : (
                    <>
                        {/* MODIFIED: Check filteredJobs.length instead of jobs.length */}
                        {sortedAndFilteredJobs.length === 0 ? (
                            <div className="text-center py-12 bg-zinc-800/50 rounded-lg border border-zinc-700">
                                <p className="text-lg text-zinc-400">
                                    {activeFilter === 'All'
                                        ? "You haven't tracked any jobs yet."
                                        : `No jobs match the "${activeFilter}" filter.`
                                    }
                                </p>
                                <p className="text-zinc-500">
                                    {activeFilter === 'All' && 'Click "+ Add New" to get started!'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedAndFilteredJobs.map((job) => (
                                    <div 
                                      key={job._id} 
                                      onClick={() => setSelectedJob(job)} 
                                      className="bg-zinc-800 border border-zinc-700 p-5 rounded-lg shadow-lg flex flex-col justify-between cursor-pointer transition-all hover:border-teal-500 hover:bg-zinc-700/60">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-teal-400 pr-2">{job.jobTitle}</h3>
                                                <div className="flex items-center gap-2">
                                                    {job.resumeUrl && <Paperclip size={16} className="text-zinc-400" />}
                                                    <StatusBadge status={job.status} />
                                                </div>
                                            </div>
                                            <p className="text-zinc-300 flex items-center">{job.company}</p>
                                            
                                            {job.jobLink && (
                                                <a href={job.jobLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-cyan-400 hover:underline text-sm flex items-center mt-1">
                                                    View Posting <ExternalLink size={14} className="ml-1" />
                                                </a>
                                            )}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-zinc-700 text-sm space-y-2">
                                            {(() => { 
                                                const { label, date } = getRelevantDate(job);

                                                // Special handling for the 'Wishlist' countdown
                                                if (job.status === 'Wishlist' && job.applyByDate) {
                                                    const { isMissed, displayText } = calculateDaysLeft(job.applyByDate);
                                                    return (
                                                        <div className={`flex items-center ${isMissed ? 'text-zinc-500 italic' : 'text-red-400'}`}>
                                                            <Calendar size={14} className="mr-2" />
                                                            {isMissed ? (
                                                                <span>Missed: {formatDateWithOrdinal(date)}</span>
                                                            ) : (
                                                                <span>
                                                                    {label}: {formatDateWithOrdinal(date)}{' '}
                                                                    <span className="font-semibold">({displayText})</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                if (job.status === 'Interviewing' && job.dateInterviewing) {
                                                    const {  displayText } = calculateDaysLeft(job.dateInterviewing);
                                                    return (
                                                        <div className={`flex items-center text-green-400`}>
                                                            <Calendar size={14} className="mr-2" />
                                                            
                                                            <span>
                                                                {label}: {formatDateWithOrdinal(date)}{' '}
                                                                <span className="font-semibold ">({displayText})</span>
                                                            </span>
                                                            
                                                        </div>
                                                    );
                                                }

                                                // Standard display for all other statuses
                                                if (date) {
                                                    return (
                                                        <p className="text-zinc-400 flex items-center">
                                                            <Calendar size={14} className="mr-2" />
                                                            {label}: {formatDateWithOrdinal(date)}
                                                        </p>
                                                    );
                                                }
                                                
                                                return null; // Return null if no relevant date to display
                                            })()}                                             
                                            {/* We will add Edit/Delete buttons here later */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
