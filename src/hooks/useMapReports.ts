// hooks/useMapReports.ts
import { useState, useEffect } from 'react';
import { Report } from '@/types';
import { ReportsService } from '@/services/api/reportsService';

interface UseMapReportsResult {
    reports: Report[];
    loading: boolean;
    error: string | null;
}

export function useMapReports(): UseMapReportsResult {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchMapReports = async () => {
            try {
                const response = await ReportsService.getMapReports();
                // @ts-ignore
                setReports(response);
                setLoading(false);
            } catch (err) {
                setError('Error fetching map reports');
                setLoading(false);
            }
        };

        fetchMapReports();
    }, []);

    return { reports, loading, error };
}