// frontend/src/components/Timeline.jsx
import { useMemo } from 'react';
import { formatDateWithOrdinal } from '../utils/dateFormatter';
import { Briefcase, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';

const TimelineEvent = ({ title, date, icon, isLast = false, color = 'bg-teal-500' }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${color} text-white flex items-center justify-center`}>
                {icon}
            </div>
            {!isLast && <div className="w-px h-full bg-zinc-600"></div>}
        </div>
        <div>
            <h3 className="font-semibold text-zinc-100">{title}</h3>
            <p className="text-sm text-zinc-400">{formatDateWithOrdinal(date)}</p>
        </div>
    </div>
);

const Timeline = ({ job }) => {
    // useMemo will create and sort the timeline events only when the job object changes.
    const events = useMemo(() => {
        const collectedEvents = [];

        // We use job.createdAt for the "Created" event
        collectedEvents.push({
            date: job.createdAt,
            title: 'Application Added to Wishlist',
            icon: <Briefcase size={16} />,
            color: 'bg-zinc-500'
        });

        if (job.dateApplied) {
            collectedEvents.push({
                date: job.dateApplied,
                title: 'Application Submitted',
                icon: <FileText size={16} />,
                color: 'bg-blue-500'
            });
        }
        if (job.dateInterviewing) {
            collectedEvents.push({
                date: job.dateInterviewing,
                title: 'Interview Scheduled',
                icon: <Calendar size={16} />,
                color: 'bg-yellow-500'
            });
        }
        if (job.dateOffer) {
            collectedEvents.push({
                date: job.dateOffer,
                title: 'Offer Received!',
                icon: <CheckCircle size={16} />,
                color: 'bg-green-500'
            });
        }
        if (job.dateRejected) {
            collectedEvents.push({
                date: job.dateRejected,
                title: 'Application Closed',
                icon: <XCircle size={16} />,
                color: 'bg-red-500'
            });
        }

        // Sort events chronologically by date
        return collectedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [job]);

    if (events.length <= 1) {
        return null; // Don't show timeline if there's only the "created" event
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-200">Timeline</h3>
            <div>
                {events.map((event, index) => (
                    <TimelineEvent
                        key={index}
                        {...event}
                        isLast={index === events.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default Timeline;