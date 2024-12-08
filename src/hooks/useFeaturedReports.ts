import { useState, useEffect } from 'react';
import { Report } from '@/types';
import ReportsService from '../services/api/reportsService'; // Adjust import path as needed

export const useFeaturedReports = () => {
    const [featuredReports, setFeaturedReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedReports = async () => {
            try {
                setLoading(true);
                const reports = await ReportsService.getFeaturedReports();

                // @ts-ignore
                setFeaturedReports(reports);
                setError(null);
            } catch (err) {
                // More detailed error logging
                console.error('Error fetching featured reports:', err);

                // Check if err is an Error instance
                const errorMessage = err instanceof Error
                    ? err.message
                    : 'An unknown error occurred while fetching featured reports';

                setError(errorMessage);
                setFeaturedReports([]); // Ensure reports are cleared on error
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedReports();
    }, []); // Empty dependency array means this runs once on mount

    return {
        featuredReports,
        loading,
        error
    };
};