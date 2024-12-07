
// hooks/useMapReports.ts
import { useState, useEffect } from 'react';
// @ts-ignore
import { getMapReports } from '../services/api/reportsService';

interface UseMapReportsResult {
    mapReports: Report[];
    loading: boolean;
    error: string | null;
}

const useMapReports = (): UseMapReportsResult => {
    const [mapReports, setMapReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMapReports = async () => {
            try {
                setLoading(true);
                const data = await getMapReports();
                // @ts-ignore
                setMapReports(data);
            } catch (err) {
                setError('Error fetching map reports');
            } finally {
                setLoading(false);
            }
        };

        fetchMapReports();
    }, []);

    return { mapReports, loading, error };
};

export default useMapReports;
