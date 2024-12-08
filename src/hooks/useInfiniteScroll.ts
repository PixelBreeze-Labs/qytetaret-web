import { useState, useEffect, useCallback } from 'react';

export function useInfiniteScroll<T>(initialData: T[], itemsPerPage: number = 12) {
    const [data, setData] = useState<T[]>([]); // Data to display
    const [page, setPage] = useState(1); // Current page
    const [hasMore, setHasMore] = useState(true); // Flag for more items

    // Update data when `initialData` changes
    useEffect(() => {
        const newData = initialData.slice(0, itemsPerPage);
        setData(newData);
        setPage(1);
        setHasMore(initialData.length > itemsPerPage);
    }, [initialData, itemsPerPage]);

    // Load more items when triggered
    const loadMore = useCallback(() => {
        if (!hasMore) return;

        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Append next items if they exist
        const nextItems = initialData.slice(startIndex, endIndex);

        if (nextItems.length > 0) {
            setData(prevData => [...prevData, ...nextItems]);
            setPage(prevPage => prevPage + 1);
        }

        // Update `hasMore`
        setHasMore(endIndex < initialData.length);
    }, [initialData, page, itemsPerPage, hasMore]);

    // Custom hook to handle scroll-based loading
    useEffect(() => {
        const handleScroll = () => {
            // Check if user is near the bottom of the page
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 100 // 100px from bottom
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    return { data, hasMore, loadMore };
}