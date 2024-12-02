export enum Category {
    INFRASTRUCTURE = 'infrastructure',
    ENVIRONMENT = 'environment',
    COMMUNITY = 'community',
    SAFETY = 'safety',
    OTHER = 'other'
}

export interface Post {
    id: string;
    content: string;
    media?: string[];
    location: {
        lat: number;
        lng: number;
        accuracy: number;
    };
    isAnonymous: boolean;
    author?: string;
    category: Category;
    timestamp: Date;
}
