import { useState, useEffect } from 'react';

export function useInfiniteScroll<T>(items: T[], perPage: number) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || loading) return;
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                setLoading(true);
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const end = page * perPage;
            const newData = items.slice(0, end);
            setData(newData);
            setHasMore(end < items.length);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [items, page, perPage]);

    return { data, loading, hasMore };
}