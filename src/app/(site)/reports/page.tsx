// src/app/(site)/reports/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { Report, Category, ReportStatus } from '@/types';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ReportCard } from '@/components/shared/ReportCard';
import Link from 'next/link';
import { dummyReports } from '@/utils/dummyReports';

export default function ReportsPage() {
    const [filter, setFilter] = useState({
        category: 'all',
        status: 'all',
        sort: 'newest'
    });

    const { data, loading, hasMore } = useInfiniteScroll(dummyReports, 12);

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
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-white">Community Reports</h1>
                <Link
                    href="/reports/new"
                    className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                    Submit Report
                </Link>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={filter.category}
                    onChange={(e) => setFilter(f => ({...f, category: e.target.value}))}
                    className="rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                >
                    <option value="all">All Categories</option>
                    {Object.values(Category).map(cat => (
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

            {loading && hasMore && (
                <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
            )}

            {!hasMore && filteredReports.length > 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No more reports to load
                </p>
            )}

            {filteredReports.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500 dark:text-gray-400">No reports found</p>
                </div>
            )}
        </div>
    );
}