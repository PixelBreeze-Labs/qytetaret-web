// ReportCard.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock } from 'lucide-react';
import { Badge } from "../ui/Badge";

const ReportCard = ({ report, showDistance = true }) => {
    const router = useRouter();
    const [distance, setDistance] = useState(null);
    const [locationError, setLocationError] = useState(false);

    const statusMap = {
        pending: 'Pending',
        in_progress: 'In Progress',
        resolved: 'Resolved',
        closed: 'Closed'
    };

    const statusVariants = {
        pending: 'warning',
        in_progress: 'info',
        resolved: 'success',
        closed: 'secondary'
    };

    useEffect(() => {
        if (showDistance && report.location && report.location.lat !== 0 && report.location.lng !== 0) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const d = calculateDistance(
                        position.coords.latitude,
                        position.coords.longitude,
                        report.location.lat,
                        report.location.lng
                    );
                    setDistance(d);
                },
                () => setLocationError(true)
            );
        }
    }, [report.location, showDistance]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    const formatDistance = (km) => {
        if (km < 1) return `${Math.round(km * 1000)}m`;
        return `${km.toFixed(1)}km`;
    };

    return (
        <div
            onClick={() => router.push(`/reports/${report.id}`)}
            className="bg-white hover:bg-gray-100/80 dark:bg-dark-3 dark:hover:bg-dark-2/90 rounded-lg border-[3px] border-gray-200/90 dark:border-gray-700/60 p-4 cursor-pointer"
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 line-clamp-1 flex-1">
                        {report.title}
                    </h3>
                    <Badge
                        variant={statusVariants[report.status]}
                        className="ml-2 flex-shrink-0"
                    >
                        {statusMap[report.status]}
                    </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>{report.author || 'Anonymous'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    {showDistance && !locationError && distance !== null &&
                        report.location && report.location.lat !== 0 && report.location.lng !== 0 && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {formatDistance(distance)}
                                </span>
                            </>
                        )}
                </div>

                <p className="text-gray-700 dark:text-gray-200 line-clamp-2">
                    {report.content}
                </p>

                <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="flex-shrink-0 dark:border-gray-600 dark:text-gray-200">
                        {report.category}
                    </Badge>
                    {report.location && !showDistance && report.location.lat !== 0 && report.location.lng !== 0 && (
                        <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {report.location.address}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export { ReportCard };