"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryReport, ReportStatus } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';
import Link from 'next/link';
import { Map, BarChart3, Loader2 } from 'lucide-react';
import { useReports } from '@/hooks/useReports';

export default function ReportsPage() {
    const t = useTranslations('reportsSingleScreen');
    const [filter, setFilter] = useState({
        category: 'all',
        status: 'all',
        sort: 'newest'
    });

    const { reports, loading, error, hasMore } = useReports(filter);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[50px] pb-[50px]">
            <div className="container mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">{t('title')}</h1>
                    <div className="flex gap-2">
                        <Link
                            href="/map"
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Map className="w-4 h-4" />
                            {t('viewMap')}
                        </Link>
                        <Link
                            href="/reports/new"
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4" />
                            {t('submitReport')}
                        </Link>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filter.category}
                            onChange={(e) => setFilter(f => ({...f, category: e.target.value}))}
                            className="rounded-lg border p-2 bg-transparent dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="all">{t('filters.allCategories')}</option>
                            {Object.values(CategoryReport).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={filter.status}
                            onChange={(e) => setFilter(f => ({...f, status: e.target.value}))}
                            className="rounded-lg border p-2 bg-transparent dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="all">{t('filters.allStatuses')}</option>
                            {Object.values(ReportStatus).map(status => (
                                <option key={status} value={status}>{status.replace('_', ' ')}</option>
                            ))}
                        </select>

                        <select
                            value={filter.sort}
                            onChange={(e) => setFilter(f => ({...f, sort: e.target.value}))}
                            className="rounded-lg border p-2 bg-transparent dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="newest">{t('filters.sortNewest')}</option>
                            <option value="oldest">{t('filters.sortOldest')}</option>
                        </select>
                    </div>
                </div>

                {/* Main Content Area */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {error && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {!loading && !error && reports.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">{t('noReports')}</p>
                        <p className="text-gray-400 dark:text-gray-500 mb-6">{t('noReportsDescription')}</p>
                        <Link
                            href="/reports/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            {t('createFirstReport')}
                        </Link>
                    </div>
                )}

                {!loading && !error && reports.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {reports.map(report => (
                                <ReportCard key={report.id} report={report} />
                            ))}
                        </div>

                        {!hasMore && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    {t('endOfReports')}
                                </p>
                                <Link
                                    href="/map"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Map className="w-5 h-5" />
                                    {t('exploreMap')}
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}