import { ReportCard } from '@/components/shared/ReportCard';
import { Post, Category } from '@/types';
import { notFound } from 'next/navigation';

export default function ReportDetailPage({ params }: { params: { id: string } }) {
    // Mock data - replace with actual data fetching
    const report: Post | null = {
        id: params.id,
        content: 'Detailed report about a community issue',
        category: Category.INFRASTRUCTURE,
        isAnonymous: true,
        location: { lat: 42.3601, lng: -71.0589, accuracy: 10 },
        timestamp: new Date(),
        media: ['/placeholder-image.jpg'], // Add a placeholder image path
    };

    if (!report) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-xl mx-auto">
                <ReportCard report={report} />

                {/* Additional report details could go here */}
                <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                    <h2 className="text-xl font-semibold mb-3">Report Details</h2>
                    <div className="space-y-2">
                        <p><strong>Report ID:</strong> {report.id}</p>
                        <p><strong>Category:</strong> {report.category}</p>
                        <p><strong>Submitted:</strong> {report.timestamp.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}