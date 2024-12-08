'use client';
import React from 'react';
import { Post, CategoryReport, ReportStatus } from '@/types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
    MapPin, Calendar, Image as ImageIcon, Tags,
    Share2, Flag, Bell, Clock, CheckCircle2,
    AlertCircle, XCircle, Loader2
} from 'lucide-react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import {useReportDetails} from "../../../../hooks/useReportDetails";

const statusColors = {
    [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [ReportStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
    [ReportStatus.RESOLVED]: 'bg-green-100 text-green-800 border-green-200',
    [ReportStatus.CLOSED]: 'bg-gray-100 text-gray-800 border-gray-200'
};

const statusIcons = {
    [ReportStatus.PENDING]: AlertCircle,
    [ReportStatus.IN_PROGRESS]: Clock,
    [ReportStatus.RESOLVED]: CheckCircle2,
    [ReportStatus.CLOSED]: XCircle
};

const mapContainerStyle = {
    width: '100%',
    height: '200px',
    borderRadius: '0.5rem'
};

export default function ReportDetailPage({ params }: { params: { id: string } }) {
    const t = useTranslations('reportDetailScreen');
    // @ts-ignore
    const unwrappedParams = React.use(params); // Use React.use() to unwrap the params
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAEe-vcJ-r8w9FQdVEskAozi1v9cWy6YAA",
    });
    // @ts-ignore
    const { report, loading, error } = useReportDetails(unwrappedParams.id);

    if (loading) {
        return <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>;
    }

    if (error || !report) {
        return <div className="text-center py-8 text-red-500">{error || 'Report not found'}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6 pt-[50px] pb-[50px]">
            <div className="max-w-7xl mx-auto">
                {/* Header with Status */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {/*// @ts-ignore*/}
                                {report.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Tags className="w-4 h-4" />
                                    {report.category}
                                </span>
                            </div>
                        </div>
                        {/*// @ts-ignore*/}
                        <div className={`px-3 py-1 rounded-full border ${statusColors[report.status]} self-start`}>
                            {/*// @ts-ignore*/}
                            {React.createElement(statusIcons[report.status], { className: 'w-4 h-4 inline mr-1' })}
                            {/*// @ts-ignore*/}
                            {report.status}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t dark:border-gray-700">
                        <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-primary">
                            <Share2 className="w-4 h-4" />
                            {t('actions.share')}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-primary">
                            <Flag className="w-4 h-4" />
                            {t('actions.report')}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-primary">
                            <Bell className="w-4 h-4" />
                            {t('actions.follow')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Report Content */}
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                {report.content}
                            </p>
                        </div>

                        {/* Media Evidence */}
                        {report.media.length > 0 && (
                            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                    {t('evidence')}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {report.media?.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Evidence ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                            <h3 className="text-lg font-semibold mb-3">
                                {t('status.timeline')}
                            </h3>
                            <div className="space-y-4">
                                {/*// @ts-ignore*/}
                                {report.timeline?.map((event, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className={`mt-1 p-1 rounded-full ${statusColors[event.status]}`}>
                                            {React.createElement(statusIcons[event.status], { className: 'w-4 h-4' })}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {event.note}
                                            </p>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {event.date.toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Location Map */}
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                {t('location')}
                            </h3>
                            {isLoaded && (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    zoom={15}
                                    center={report.location}
                                >
                                    <MarkerF position={report.location} />
                                </GoogleMap>
                            )}
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {`${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                            <h3 className="text-lg font-semibold mb-3">
                                {t('reportMetadata')}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">{t('reportId')}:</span>
                                    <span className="font-medium">{report.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">{t('accuracy')}:</span>
                                    <span className="font-medium">{report.location.accuracy}m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">{t('anonymous')}:</span>
                                    <span className="font-medium">
                                        {report.isAnonymous ? t('anonymousYes') : t('anonymousNo')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Related Reports */}
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                            <h3 className="text-lg font-semibold mb-3">
                                {t('relatedReports')}
                            </h3>
                            <div className="space-y-3">
                                {Array(2).fill(null).map((_, i) => (
                                    <Link
                                        key={i}
                                        href={`/reports/${i + 2}`}
                                        className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                Similar infrastructure issue
                                            </span>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[ReportStatus.PENDING]}`}>
                                                {ReportStatus.PENDING}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            2 days ago
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

