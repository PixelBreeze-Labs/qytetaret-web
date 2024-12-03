import { useState, useEffect } from 'react';

export function useInfiniteScroll<T>(items: T[], perPage: number) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                setLoading(true);
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const end = page * perPage;
            setData(items.slice(0, end));
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [items, page, perPage]);

    return { data, loading };
}