// hooks/useReports.ts
import { useState, useEffect } from 'react';
// @ts-ignore
import { getReports } from '../services/api/reportsService';

interface UseReportsResult {
    reports: Report[];
    loading: boolean;
    error: string | null;
}

const useReports = (): UseReportsResult => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const data = await getReports();
                // @ts-ignore
                setReports(data);
            } catch (err) {
                setError('Error fetching all reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return { reports, loading, error };
};

export default useReports;
