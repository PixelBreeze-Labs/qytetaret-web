"use client";

import { useState, useMemo } from 'react';
import { Report, CategoryReport, ReportStatus } from '@/types';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ReportCard } from '@/components/shared/ReportCard';
import { Hero } from '@/components/shared/Hero';

const dummyReports = Array.from({ length: 100 }, (_, i) => ({
    id: `${i}`,
    title: `Report #${i}`,
    content: `This is a sample report about ${['roads', 'parks', 'lighting', 'trash'][i % 4]} that needs attention...`,
    category: Object.values(CategoryReport)[i % 4],
    isAnonymous: i % 3 === 0,
    author: i % 3 === 0 ? undefined : `User ${i}`,
    location: {
        lat: 41.3275 + (Math.random() - 0.5) * 0.1,
        lng: 19.8187 + (Math.random() - 0.5) * 0.1,
        accuracy: 10
    },
    media: i % 2 === 0 ? [`https://picsum.photos/200/200?random=${i}`] : [],
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
    updatedAt: new Date(),
    status: Object.values(ReportStatus)[i % 4]
}));

export default function HomePage() {
    const [filter, setFilter] = useState({
        category: 'all',
        status: 'all',
        sort: 'newest'
    });

    const { data, loading } = useInfiniteScroll(dummyReports, 12);

    const filteredReports = useMemo(() => {
        return data
            .filter(report => filter.category === 'all' || report.category === filter.category)
            .filter(report => filter.status === 'all' || report.status === filter.status)
            .sort((a, b) => filter.sort === 'newest' ?
                b.createdAt.getTime() - a.createdAt.getTime() :
                a.createdAt.getTime() - b.createdAt.getTime()
            );
    }, [data, filter]);

    return (
        <>
            <Hero />
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-4 mb-6">
                    <select
                        value={filter.category}
                        onChange={(e) => setFilter(f => ({...f, category: e.target.value}))}
                        className="rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value="all">All Categories</option>
                        {Object.values(CategoryReport).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={filter.status}
                        onChange={(e) => setFilter(f => ({...f, status: e.target.value}))}
                        className="rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value="all">All Statuses</option>
                        {Object.values(ReportStatus).map(status => (
                            <option key={status} value={status}>{status.replace('_', ' ')}</option>
                        ))}
                    </select>

                    <select
                        value={filter.sort}
                        onChange={(e) => setFilter(f => ({...f, sort: e.target.value}))}
                        className="rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredReports.map(report => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </>
    );
}