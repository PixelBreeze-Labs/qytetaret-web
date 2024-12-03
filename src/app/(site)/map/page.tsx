// src/app/(site)/map/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { dummyReports } from '@/utils/dummyReports';
import { Report, Category, ReportStatus } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';

export default function MapPage() {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [filter, setFilter] = useState({
        category: 'all',
        status: 'all'
    });

    const filteredReports = dummyReports
        .filter(report => filter.category === 'all' || report.category === filter.category)
        .filter(report => filter.status === 'all' || report.status === filter.status);

    return (
        <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Report Map</h1>
    </div>

    <div className="flex gap-6">
        {/* Map Filters */}
        <div className="w-64 space-y-4">
    <select
        value={filter.category}
    onChange={(e) => setFilter(f => ({...f, category: e.target.value}))}
    className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
    >
    <option value="all">All Categories</option>
    {Object.values(Category).map(cat => (
        <option key={cat} value={cat}>{cat}</option>
    ))}
    </select>

    <select
    value={filter.status}
    onChange={(e) => setFilter(f => ({...f, status: e.target.value}))}
    className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
    >
    <option value="all">All Statuses</option>
    {Object.values(ReportStatus).map(status => (
        <option key={status} value={status}>{status.replace('_', ' ')}</option>
    ))}
    </select>

    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
    <h3 className="font-bold mb-2 dark:text-white">Reports Found</h3>
    <p className="text-gray-600 dark:text-gray-400">{filteredReports.length} reports in this area</p>
    </div>

    {selectedReport && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <ReportCard report={selectedReport} />
    </div>
    )}
    </div>

    {/* Map Area */}
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-[600px]">
        {/* Add Map Component Here */}
        <div className="h-full flex items-center justify-center">
    <p className="text-gray-500 dark:text-gray-400">Map integration coming soon</p>
    </div>
    </div>
    </div>
    </div>
);
}