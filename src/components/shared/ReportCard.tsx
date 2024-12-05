"use client";

import { Report } from '@/types';
import Image from 'next/image';
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

    return (
        <div
            className="bg-white dark:bg-[#1E1E1E] hover:dark:bg-[#252525] cursor-pointer rounded-lg shadow-md dark:shadow-gray-900/30 p-4 hover:shadow-lg transition-all"
            onClick={() => router.push(`/reports/${report.id}`)}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{report.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.isAnonymous ? 'Anonymous' : report.author} • {new Date(report.createdAt).toLocaleDateString()}
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
                {report.media?.length > 0 && (
                    <div className="flex -space-x-2">
                        {report.media.slice(0,3).map((url, i) => (
                            <Image
                                key={i}
                                src={url}
                                alt=""
                                width={32}
                                height={32}
                                className="rounded-full border-2 border-white dark:border-[#1E1E1E]"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};