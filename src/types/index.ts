export enum ReportStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed'
}

export interface Post {
    id: string;
    content: string;
    category: CategoryReport;
    isAnonymous: boolean;
    location: {
        lat: number;
        lng: number;
        accuracy: number;
    };
    timestamp: Date;
    media?: string[];
}

export interface Activity {
    type: 'CREATED' | 'UPDATED';
    date: Date;
    status: ReportStatus;
}

export enum CategoryReport {
    INFRASTRUCTURE = 'infrastructure',
    ENVIRONMENT = 'environment',
    COMMUNITY = 'community',
    SAFETY = 'safety',
    OTHER = 'other'
}

export enum ActivityType {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    STATUS_CHANGED = 'STATUS_CHANGED'
}
export interface Report {
    id: string;
    title: string;
    content: string;
    media?: string[];
    location: {
        lat: number;
        lng: number;
        accuracy: number;
    };
    isAnonymous: boolean;
    author?: string;
    category: CategoryReport;
    status: ReportStatus;
    createdAt: Date;
    updatedAt: Date;
    audio?: string;
    activities: Activity[];
}
