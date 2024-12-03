import { Report } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface ReportCardProps {
    report: Report;
}

export const ReportCard = ({ report }: ReportCardProps) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        closed: 'bg-gray-100 text-gray-800'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
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
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {report.category}
                </span>
                {/*// @ts-ignore*/}
                {report.media?.length > 0 && (
                    <div className="flex -space-x-2">
                        {/*// @ts-ignore*/}
                        {report.media.slice(0,3).map((url, i) => (
                            <Image
                                key={i}
                                src={url}
                                alt=""
                                width={32}
                                height={32}
                                className="rounded-full border-2 border-white"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};