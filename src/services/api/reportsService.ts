import { makeApiRequest } from './api';
import { CategoryReport } from '@/types';

// Comprehensive Report interface matching backend entity
export interface Report {
    id: string;
    title: string;
    content: string;
    category: CategoryReport;
    isAnonymous: boolean;
    authorId?: string;
    media?: string[]; // URLs of uploaded media
    audioUrl?: string;
    location?: {
        lat: number;
        lng: number;
        accuracy?: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ReportResponse<T> {
    data: T;
    message: string;
    status: string;
}

// Interface for creating a report, matching CreateReportDto
export interface CreateReportDto {
    title: string;
    content: string;
    category: CategoryReport;
    isAnonymous: boolean;
    media?: File[];
    audio?: Blob;
    location?: {
        lat: number;
        lng: number;
        accuracy?: number;
    };
}

// Interface for updating a report, matching UpdateReportDto
export interface UpdateReportDto {
    title?: string;
    content?: string;
    category?: CategoryReport;
    isAnonymous?: boolean;
    media?: string[]; // URLs of media
    audioUrl?: string;
    location?: {
        lat: number;
        lng: number;
        accuracy?: number;
    };
}

export class ReportsService {
    // Create a new report with media upload support
    // ReportsService.ts
    static async create(formData: FormData): Promise<Report> {
        try {
            const data = {
                title: formData.get('title'),
                content: formData.get('content'),
                category: formData.get('category'),
                isAnonymous: formData.get('isAnonymous') === 'true',
                location: {
                    lat: Number(formData.get('location.lat')),
                    lng: Number(formData.get('location.lng')),
                    accuracy: Number(formData.get('location.accuracy'))
                }
            };

            const response = await makeApiRequest<ReportResponse<Report>>('/reports', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            return response.data;
        } catch (error) {
            console.error('Error creating report:', error);
            throw error;
        }
    }

    // Fetch all reports
    static async findAll(): Promise<Report[]> {
        try {
            const response = await makeApiRequest<ReportResponse<Report[]>>('/reports', { method: 'GET' });
            return response.data;
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw new Error('Failed to fetch reports');
        }
    }

    // Fetch featured reports
    static async getFeaturedReports(): Promise<Report[]> {
        try {
            const response = await makeApiRequest<ReportResponse<Report[]>>('/reports/featured', { method: 'GET' });
            return response.data;
        } catch (error) {
            console.error('Error fetching featured reports:', error);
            throw new Error('Failed to fetch featured reports');
        }
    }

    // Fetch reports for map view
    static async getMapReports(): Promise<Report[]> {
        try {
            const response = await makeApiRequest<ReportResponse<Report[]>>('/reports/map', { method: 'GET' });
            return response.data;
        } catch (error) {
            console.error('Error fetching map reports:', error);
            throw new Error('Failed to fetch map reports');
        }
    }

    // Find reports near a specific location
    static async findNearby(
        lat: number,
        lng: number,
        distance?: number
    ): Promise<Report[]> {
        try {
            const queryParams = new URLSearchParams({
                lat: lat.toString(),
                lng: lng.toString(),
                ...(distance ? { distance: distance.toString() } : {})
            });

            const response = await makeApiRequest<ReportResponse<Report[]>>(
                `/reports/nearby?${queryParams}`,
                { method: 'GET' }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching nearby reports:', error);
            throw new Error('Failed to fetch nearby reports');
        }
    }

    // Fetch a specific report by ID
    static async findOne(id: string): Promise<Report> {
        try {
            const response = await makeApiRequest<ReportResponse<Report>>(`/reports/${id}`, { method: 'GET' });
            return response.data;
        } catch (error) {
            console.error(`Error fetching report with ID ${id}:`, error);
            throw new Error(`Failed to fetch report with ID ${id}`);
        }
    }

    // Update an existing report
    static async update(id: string, reportData: UpdateReportDto): Promise<Report> {
        try {
            const response = await makeApiRequest<ReportResponse<Report>>(`/reports/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData),
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating report with ID ${id}:`, error);
            throw new Error(`Failed to update report with ID ${id}`);
        }
    }

    // Delete a report
    static async remove(id: string): Promise<void> {
        try {
            await makeApiRequest<void>(`/reports/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error(`Error deleting report with ID ${id}:`, error);
            throw new Error(`Failed to delete report with ID ${id}`);
        }
    }
}

// Export as both named export and default export for flexibility
export default ReportsService;