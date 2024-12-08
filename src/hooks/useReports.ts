import { useState, useEffect } from 'react';
import { Report } from '@/types';
import ReportsService from '@/services/api/reportsService';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface UseReportsResult {
    reports: Report[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
}

export function useReports(filters: { category: string; status: string; sort: string }): UseReportsResult {
    const [allReports, setAllReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await ReportsService.findAll();
                if (!isActive) return;

                const filtered = response
                    .filter(report => filters.category === 'all' || report.category === filters.category)
                    // @ts-ignore
                    .filter(report => filters.status === 'all' || report.status === filters.status)
                    .sort((a, b) =>
                        filters.sort === 'newest'
                            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    );
                // @ts-ignore
                setAllReports(filtered);
            } catch (err) {
                if (!isActive) return;
                setError('Error fetching reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
        return () => {
            isActive = false;
        };
    }, [filters]);

    const { data, hasMore, loadMore } = useInfiniteScroll(allReports, 12);

    return {
        reports: data,
        loading,
        error,
        hasMore,
        loadMore
    };
}