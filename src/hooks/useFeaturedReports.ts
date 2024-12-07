// hooks/useFeaturedReports.ts
import { useState, useEffect } from 'react';
// @ts-ignore
import { getFeaturedReports } from '../services/api/reportsService';

interface UseFeaturedReportsResult {
    featuredReports: Report[];
    loading: boolean;
    error: string | null;
}

const useFeaturedReports = (): UseFeaturedReportsResult => {
    const [featuredReports, setFeaturedReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedReports = async () => {
            try {
                setLoading(true);
                const data = await getFeaturedReports();
                // @ts-ignore
                setFeaturedReports(data);
            } catch (err) {
                setError('Error fetching featured reports');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedReports();
    }, []);

    return { featuredReports, loading, error };
};

export default useFeaturedReports;
