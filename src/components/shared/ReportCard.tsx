"use client";

import { Report } from '@/types';
import { useRouter } from 'next/navigation';

interface ReportCardProps {
    report: Report;
}

export const ReportCard = ({ report }: ReportCardProps) => {
    const statusColors = {
        pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
        in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
        resolved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
        closed: 'bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300'
    };

    const router = useRouter();

    // Display name logic - show Anonymous if no author OR isAnonymous
    const displayName = (report.isAnonymous || !report.author) ? 'Anonymous' : report.author;

    // Helper for avatar color
    const stringToColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    return (
        <div
            className="bg-white dark:bg-[#1E1E1E] hover:dark:bg-[#252525] cursor-pointer rounded-lg shadow-md dark:shadow-gray-900/30 p-4 hover:shadow-lg transition-all"
            onClick={() => router.push(`/reports/${report.id}`)}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{report.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {displayName} • {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                   {report.status?.replace('_', ' ')}
               </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{report.content}</p>

            <div className="flex items-center justify-between mt-auto">
               <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-red-400 rounded-full text-sm">
                   {report.category}
               </span>

                {/* Simple Avatar with initials */}
                <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-sm text-white"
                    style={{ backgroundColor: stringToColor(displayName) }}
                >
                    {displayName.slice(0, 2).toUpperCase()}
                </div>
            </div>
        </div>
    );
};