// AIzaSyAEe-vcJ-r8w9FQdVEskAozi1v9cWy6YAA

"use client";
import { useEffect, useState, useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Report, CategoryReport, ReportStatus } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';
import { useTranslations } from 'next-intl';
import { Filter, MapPin, Info, AlertTriangle } from 'lucide-react';
import { useMapReports } from '@/hooks/useMapReports';

const mapContainerStyle = {
    width: '100%',
    height: 'calc(100vh - 200px)',
    borderRadius: '0.75rem'
};

const markerIcons = {
    [CategoryReport.INFRASTRUCTURE]: '/icons/marker-infrastructure.svg',
    [CategoryReport.ENVIRONMENT]: '/icons/marker-environment.svg',
    [CategoryReport.COMMUNITY]: '/icons/marker-community.svg',
    [CategoryReport.SAFETY]: '/icons/marker-safety.svg',
    [CategoryReport.OTHER]: '/icons/marker-other.svg',
};


const statusColors = {
    [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ReportStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [ReportStatus.RESOLVED]: 'bg-green-100 text-green-800',
    [ReportStatus.CLOSED]: 'bg-gray-100 text-gray-800'
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
};

const center = {
    lat: 41.3275, // Tirana coordinates
    lng: 19.8187
};

export default function MapPage() {
    const t = useTranslations('map');
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAEe-vcJ-r8w9FQdVEskAozi1v9cWy6YAA",
        libraries: ['places']
    });

    const { reports, loading, error } = useMapReports();

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [filter, setFilter] = useState({
        category: 'all',
        status: 'all',
        timeframe: 'all'
    });

    const filteredReports = useMemo(() => {
        if (!Array.isArray(reports)) return [];

        return reports
            .filter(report => filter.category === 'all' || report.category === filter.category)
            .filter(report => filter.status === 'all' || report.status === filter.status)
            .filter(report => {
                if (filter.timeframe === 'all') return true;
                const reportDate = new Date(report.createdAt || '');
                const now = new Date();

                switch (filter.timeframe) {
                    case 'today':
                        return reportDate.toDateString() === now.toDateString();
                    case 'week':
                        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                        return reportDate >= oneWeekAgo;
                    case 'month':
                        return reportDate.getMonth() === now.getMonth() &&
                            reportDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
    }, [reports, filter]);

    if (!isLoaded || loading) {
        return <div className="flex items-center justify-center h-[60vh]">{t('loading')}</div>;
    }
    return (
        <div className="container mx-auto pt-[50px] pb-[50px] px-4 py-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-9">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold dark:text-white mb-2">{t('title')}</h1>
                            <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4 mb-6">
                        <div className="flex flex-wrap gap-4">
                            <select
                                value={filter.category}
                                onChange={(e) => setFilter(f => ({...f, category: e.target.value}))}
                                className="w-full md:w-auto rounded-lg border px-4 py-2 dark:bg-gray-800 dark:border-gray-700 min-w-[200px]"
                            >
                                <option value="all">{t('filters.allCategories')}</option>
                                {Object.values(CategoryReport).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                value={filter.status}
                                onChange={(e) => setFilter(f => ({...f, status: e.target.value}))}
                                className="w-full md:w-auto rounded-lg border px-4 py-2 dark:bg-gray-800 dark:border-gray-700 min-w-[200px]"
                            >
                                <option value="all">{t('filters.allStatuses')}</option>
                                {Object.values(ReportStatus).map(status => (
                                    <option key={status} value={status}>
                                        {t(`statuses.${status.toLowerCase().replace('_', '')}`)}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filter.timeframe}
                                onChange={(e) => setFilter(f => ({...f, timeframe: e.target.value}))}
                                className="w-full md:w-auto rounded-lg border px-4 py-2 dark:bg-gray-800 dark:border-gray-700 min-w-[200px]"
                            >
                                <option value="all">{t('filters.allTime')}</option>
                                <option value="today">{t('filters.today')}</option>
                                <option value="week">{t('filters.thisWeek')}</option>
                                <option value="month">{t('filters.thisMonth')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={13}
                            center={center}
                            options={mapOptions}
                        >
                            {filteredReports.map(report => (
                                report.location && (
                                    <MarkerF
                                        key={report.id}
                                        position={{
                                            lat: report.location.lat,
                                            lng: report.location.lng
                                        }}
                                        onClick={() => setSelectedReport(report)}
                                        icon={{
                                            url: markerIcons[report.category.toLowerCase()],
                                            scaledSize: new google.maps.Size(30, 30)
                                        }}
                                        animation={google.maps.Animation.DROP}
                                    />
                                )
                            ))}

                            {selectedReport?.location && (
                                <InfoWindowF
                                    position={{
                                        lat: selectedReport.location.lat,
                                        lng: selectedReport.location.lng
                                    }}
                                    onCloseClick={() => setSelectedReport(null)}
                                >
                                    <div className="max-w-sm">
                                        <ReportCard report={selectedReport} />
                                    </div>
                                </InfoWindowF>
                            )}
                        </GoogleMap>
                    </div>
                </div>

                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Info size={20} />
                            {t('overview.title')}
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {t('overview.totalReports')}
                                </span>
                                <span className="font-bold">{filteredReports.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {t('overview.active')}
                                </span>
                                <span className="font-bold">
                                    {filteredReports.filter(r => r.status === ReportStatus.IN_PROGRESS).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {t('overview.resolved')}
                                </span>
                                <span className="font-bold">
                                    {filteredReports.filter(r => r.status === ReportStatus.RESOLVED).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedReport && (
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <MapPin size={20} />
                                {t('selectedReport.title')}
                            </h3>
                            <ReportCard report={selectedReport} />
                        </div>
                    )}

                    {/* Category Legend */}
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Filter size={20} />
                            {t('legend.title')}
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(markerIcons).map(([category, icon]) => (
                                <div key={category} className="flex items-center gap-2">
                                    <img src={icon} alt={category} className="w-6 h-6" />
                                    <span className="text-gray-600 dark:text-gray-400">{category}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h3 className="font-bold mb-2 flex items-center gap-2 text-red-700 dark:text-red-300">
                            <AlertTriangle size={20} />
                            {t('emergency.title')}
                        </h3>
                        <a href="tel:129" className="text-2xl font-bold text-red-700 dark:text-red-300">
                            {t('emergency.call')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}