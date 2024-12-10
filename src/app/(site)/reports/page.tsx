"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryReport, ReportStatus } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';
import Link from 'next/link';
import { Map, BarChart3, Loader2, X, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useInView } from 'react-intersection-observer';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/useScroll';
import ReportChatbot from "../../../components/ReportChatbot";

export default function ReportsPage() {
    const t = useTranslations('reportsSingleScreen');
    const [filter, setFilter] = useState({
        category: 'all',
        status: 'all',
        sort: 'newest',
        distance: 'all'
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterVisible, setIsFilterVisible] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const lastScrollTop = useRef(0);

    // Infinite scroll setup
    const { ref: loadMoreRef, inView } = useInView();
    const { reports, loading, error, hasMore, loadMore } = useReports(filter);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMore();
        }
    }, [inView, hasMore, loading]);

    // Handle scroll for sticky header
    useScroll((scrollTop) => {
        const isScrollingDown = scrollTop > lastScrollTop.current;
        lastScrollTop.current = scrollTop;
        setIsFilterVisible(!isScrollingDown || scrollTop < 100);
    });

    const removeFilter = (key: string) => {
        setFilter(prev => ({ ...prev, [key]: 'all' }));
    };

    const getActiveFilters = () => {
        return Object.entries(filter).filter(([_, value]) => value !== 'all');
    };

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-dark-3 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-dark-4 rounded w-3/4 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-dark-4 rounded"></div>
                            <div className="h-3 bg-gray-200 dark:bg-dark-4 rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-2 pt-[160px] md:pt-[60px] dark:to-dark-3">
            {/* Sticky Header */}
            <div
                className="fixed top-[82px] left-0 right-0 z-40 bg-white dark:bg-dark-2 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h1 className="text-2xl font-bold dark:text-white">{t('title')}</h1>
                        <div className="mt-4 flex gap-2">
                            <div
                                className="bg-white hidden dark:bg-dark-3 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        viewMode === 'grid' ?
                                            "bg-gray-100 dark:bg-dark-4" :
                                            "hover:bg-gray-50 dark:hover:bg-dark-4"
                                    )}
                                >
                                    <Grid className="w-4 h-4"/>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        viewMode === 'list' ?
                                            "bg-gray-100 dark:bg-dark-4" :
                                            "hover:bg-gray-50 dark:hover:bg-dark-4"
                                    )}
                                >
                                    <List className="w-4 h-4"/>
                                </button>
                            </div>
                            <Link
                                href="/map"
                                className="px-4 py-2 bg-white dark:bg-dark-3 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-4 transition-colors inline-flex items-center gap-2"
                            >
                                <Map className="w-4 h-4"/>
                                {t('viewMap')}
                            </Link>
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                            >
                                <BarChart3 className="w-4 h-4"/>
                                {t('submitReport')}
                            </button>

                            {/* Add ReportChatbot modal */}
                            {showReportModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                    <div className="w-full max-w-2xl">
                                        <ReportChatbot onClose={() => setShowReportModal(false)}/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <select
                            value={filter.category}
                            onChange={(e) => setFilter(f => ({...f, category: e.target.value}))}
                            className="rounded-lg border px-3 py-1.5 bg-transparent dark:bg-dark-3 dark:border-gray-700 dark:text-white"
                        >
                            <option value="all">{t('filters.allCategories')}</option>
                            {Object.values(CategoryReport).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={filter.status}
                            onChange={(e) => setFilter(f => ({...f, status: e.target.value}))}
                            className="rounded-lg border px-3 py-1.5 bg-transparent dark:bg-dark-3 dark:border-gray-700 dark:text-white"
                        >
                            <option value="all">{t('filters.allStatuses')}</option>
                            {Object.values(ReportStatus).map(status => (
                                <option key={status} value={status}>
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filter.sort}
                            onChange={(e) => setFilter(f => ({...f, sort: e.target.value}))}
                            className="rounded-lg border px-3 py-1.5 bg-transparent dark:bg-dark-3 dark:border-gray-700 dark:text-white"
                        >
                            <option value="newest">{t('filters.sortNewest')}</option>
                            <option value="oldest">{t('filters.sortOldest')}</option>
                            <option value="nearest">{t('filters.sortNearest')}</option>
                            <option value="urgent">{t('filters.sortUrgent')}</option>
                        </select>
                    </div>

                    {/* Active Filters */}
                    {getActiveFilters().length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {getActiveFilters().map(([key, value]) => (
                                <Badge
                                    key={key}
                                    variant="secondary"
                                    className="px-3 py-1 flex items-center gap-1"
                                >
                                    {value}
                                    <button
                                        onClick={() => removeFilter(key)}
                                        className="ml-1 hover:text-primary"
                                    >
                                        <X className="w-3 h-3"/>
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4" style={{marginTop: '160px'}}>
                {loading && <LoadingSkeleton/>}

                {error && (
                    <div className="text-center py-12 bg-white dark:bg-dark-3 rounded-lg">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {!loading && !error && reports.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-dark-3 rounded-lg">
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                            {t('noReports')}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {t('noReportsDescription')}
                        </p>
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
                        <div className={cn(
                            "grid gap-4",
                            viewMode === 'grid' ?
                                "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" :
                                "grid-cols-1"
                        )}>
                            {reports.map(report => (
                                <ReportCard
                                    key={report.id}
                                    report={report}
                                    // @ts-ignore
                                    className={viewMode === 'list' ? 'max-w-none' : ''}
                                />
                            ))}
                        </div>

                        {/* Load More Trigger */}
                        <div ref={loadMoreRef} className="h-10" />

                        {loading && hasMore && (
                            <div className="text-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                            </div>
                        )}

                        {!hasMore && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    {t('endOfReports')}
                                </p>
                                <Link
                                    href="/map"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-dark-3 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-4 transition-colors"
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