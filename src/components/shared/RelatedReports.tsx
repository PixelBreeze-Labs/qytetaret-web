import React from 'react';
import { Post } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';

interface RelatedReportsProps {
    reports: Post[];
}

export const RelatedReports: React.FC<RelatedReportsProps> = ({ reports }) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Related Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                    // @ts-ignore
                    <ReportCard key={report.id} report={report} />
                ))}
            </div>
        </div>
    );
};