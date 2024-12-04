// src/app/(site)/map/page.tsx
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { dummyReports } from '@/utils/dummyReports';
import { Report, Category, ReportStatus } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';

const mapContainerStyle = {
    width: '100%',
        height: '600px',
    borderRadius: '0.5rem'
};

const markerIcons = {
    [Category.INFRASTRUCTURE]: '/icons/marker-infrastructure.svg',
    [Category.ENVIRONMENT]: '/icons/marker-environment.svg',
    [Category.COMMUNITY]: '/icons/marker-community.svg',
    [Category.SAFETY]: '/icons/marker-safety.svg',
    [Category.OTHER]: '/icons/marker-other.svg',
};

const statusColors = {
    [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ReportStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [ReportStatus.RESOLVED]: 'bg-green-100 text-green-800',
    [ReportStatus.CLOSED]: 'bg-gray-100 text-gray-800'
};

const mapOptions = {
    styles: [/* Custom map styles */],
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
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAEe-vcJ-r8w9FQdVEskAozi1v9cWy6YAA",
        libraries: ['places']
    });

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [filter, setFilter] = useState({
        category: 'all',
        status: 'all'
    });

    const filteredReports = useMemo(() =>
            dummyReports
                .filter(report => filter.category === 'all' || report.category === filter.category)
                .filter(report => filter.status === 'all' || report.status === filter.status),
        [filter]
    );

    const onMarkerClick = useCallback((report: Report) => {
        setSelectedReport(report);
    }, []);

    if (!isLoaded) return <div>Loading maps...</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-white">Report Map</h1>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Filters panel */}
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

                    {/* Report count */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <h3 className="font-bold mb-2 dark:text-white">Reports Found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filteredReports.length} reports in this area
                        </p>
                    </div>

                    {/* Selected report details */}
                    {selectedReport && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                            <ReportCard report={selectedReport} />
                        </div>
                    )}
                </div>

                {/* Map */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-[600px]">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={13}
                        center={center}
                        options={mapOptions}
                    >
                        {filteredReports.map(report => (
                            <MarkerF
                                key={report.id}
                                position={{
                                    lat: report.location.lat,
                                    lng: report.location.lng
                                }}
                                onClick={() => onMarkerClick(report)}
                                icon={{
                                    url: markerIcons[report.category],
                                    scaledSize: new google.maps.Size(30, 30)
                                }}
                                animation={google.maps.Animation.DROP}
                            />
                        ))}

                        {selectedReport && (
                            <InfoWindowF
                                position={{
                                    lat: selectedReport.location.lat,
                                    lng: selectedReport.location.lng
                                }}
                                onCloseClick={() => setSelectedReport(null)}
                                options={{
                                    pixelOffset: new google.maps.Size(0, -30)
                                }}
                            >
                                <div className="p-2 max-w-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-lg">{selectedReport.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[selectedReport.status]}`}>
                    {selectedReport.status.replace('_', ' ')}
                </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2">{selectedReport.content}</p>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                                        <span>{selectedReport.isAnonymous ? 'Anonymous' : selectedReport.author}</span>
                                    </div>

                                    {selectedReport.media && selectedReport.media.length > 0 && (
                                        <div className="mt-2 flex gap-1">
                                            {selectedReport.media.slice(0, 3).map((url, i) => (
                                                <img
                                                    key={i}
                                                    src={url}
                                                    alt=""
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {/* Add view details handler */}}
                                        className="mt-2 w-full text-center text-sm text-primary hover:text-primary/80"
                                    >
                                        View Full Report
                                    </button>
                                </div>
                            </InfoWindowF>
                        )}
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
}