// src/utils/dummyReports.ts
import { Report, CategoryReport, ReportStatus } from '@/types';

export const dummyReports = Array.from({ length: 100 }, (_, i) => ({
    id: `${i}`,
    title: `Report #${i}`,
    content: `This is a sample report about ${['roads', 'parks', 'lighting', 'trash'][i % 4]} that needs attention...`,
    category: Object.values(CategoryReport)[i % 4],
    isAnonymous: i % 3 === 0,
    author: i % 3 === 0 ? undefined : `User ${i}`,
    location: {
        lat: 41.3275 + (Math.random() - 0.5) * 0.1,
        lng: 19.8187 + (Math.random() - 0.5) * 0.1,
        accuracy: 10
    },
    media: i % 2 === 0 ? [`https://picsum.photos/200/200?random=${i}`] : [],
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
    updatedAt: new Date(),
    status: Object.values(ReportStatus)[i % 4]
}));