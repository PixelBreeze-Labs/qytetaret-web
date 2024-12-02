import { ReportCard } from '@/components/shared/ReportCard';
import { Post, Category } from '@/types';

export default function HomePage() {
    // Mock data - replace with actual data fetching
    const mockReports: Post[] = [
        {
            id: '1',
            content: 'Pothole on Main Street needs repair',
            category: Category.INFRASTRUCTURE,
            isAnonymous: true,
            location: { lat: 42.3601, lng: -71.0589, accuracy: 10 },
            timestamp: new Date(),
        },
        {
            id: '2',
            content: 'Community garden cleanup needed',
            category: Category.COMMUNITY,
            isAnonymous: false,
            author: 'Local Resident',
            location: { lat: 42.3615, lng: -71.0572, accuracy: 10 },
            timestamp: new Date(),
        }
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-red-600">
                Community Reports
            </h1>

            <div className="max-w-xl mx-auto">
                {mockReports.map(report => (
                    <ReportCard key={report.id} report={report} />
                ))}
            </div>
        </div>
    );
}
