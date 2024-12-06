import React from 'react';
import { Post, CategoryReport } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';
import { RelatedReports } from '@/components/shared/RelatedReports';

const ReportDetailPage = () => {
    const id = '0';

    // Mock data - replace with actual data fetching
    const report: Post = {
        id: id as string,
        content:
            'Detailed report about a community issue that needs to be addressed. The report includes information about the problem and its impact on the local area.',
        category: CategoryReport.INFRASTRUCTURE,
        isAnonymous: true,
        location: { lat: 42.3601, lng: -71.0589, accuracy: 10 },
        timestamp: new Date(),
        // @ts-ignore
        createdAt: new Date(Date.now() - Math.random() * 10000000000),
        media: [`https://picsum.photos/200/200?random=${id}`],
    };

    // Mock related reports data
    const relatedReports: Post[] = [
        {
            id: '1',
            content: 'Another report about a similar infrastructure issue',
            category: CategoryReport.INFRASTRUCTURE,
            isAnonymous: false,
            location: {lat: 42.3602, lng: -71.0590, accuracy: 12},
            timestamp: new Date('2024-03-15'),
            // @ts-ignore
            createdAt: new Date(Date.now() - Math.random() * 10000000000),
            media: [`https://picsum.photos/200/200?random=${id}`],
        },
        {
            id: '2',
            content: 'Report about a community event',
            category: CategoryReport.COMMUNITY,
            isAnonymous: true,
            location: { lat: 42.3603, lng: -71.0591, accuracy: 8 },
            timestamp: new Date('2024-02-28'),
            // @ts-ignore
            createdAt: new Date(Date.now() - Math.random() * 10000000000),
            media: [`https://picsum.photos/200/200?random=${id}`],
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/*// @ts-ignore*/}
                <ReportCard report={report} />

                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Report Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p>
                                <strong>Report ID:</strong> {report.id}
                            </p>
                            <p>
                                <strong>Category:</strong> {report.category}
                            </p>
                            <p>
                                <strong>Submitted:</strong> {report.timestamp.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Location:</strong>{' '}
                                {`${report.location.lat}, ${report.location.lng}`}
                            </p>
                            <p>
                                <strong>Accuracy:</strong> {report.location.accuracy} meters
                            </p>
                            <p>
                                <strong>Anonymous:</strong> {report.isAnonymous ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">Report Content</h3>
                        <p>{report.content}</p>
                    </div>
                </div>

                <RelatedReports reports={relatedReports} />
            </div>
        </div>
    );
};

export default ReportDetailPage;