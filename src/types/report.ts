export interface Report {
 id: string;
 title: string;
 description: string;
 location: {
   type: string;
   coordinates: [number, number];
 };
 category: string;
 status: 'pending' | 'in_progress' | 'resolved' | 'closed';
 media?: string[];
 createdAt: Date;
 updatedAt: Date;
}
