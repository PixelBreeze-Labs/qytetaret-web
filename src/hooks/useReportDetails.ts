// hooks/useReportDetails.ts
import { useState, useEffect } from 'react';
import { Report } from '@/types';
import ReportsService from '@/services/api/reportsService';

export function useReportDetails(id: string) {
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                const response = await ReportsService.findOne(id);
                // @ts-ignore
                setReport(response);
                setLoading(false);
            } catch (err) {
                setError('Error fetching report details');
                setLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

    return { report, loading, error };
}