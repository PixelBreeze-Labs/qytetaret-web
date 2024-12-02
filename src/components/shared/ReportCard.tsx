import Image from 'next/image';
import { MapPin, User } from 'lucide-react';
import { Post } from '@/types';

interface ReportCardProps {
    report: Post;
}

export function ReportCard({ report }: ReportCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <div className="flex items-center mb-2">
                        {report.isAnonymous ? (
                            <User className="w-5 h-5 text-gray-500 mr-2" />
                        ) : (
                            <span className="mr-2 text-sm text-gray-600">{report.author}</span>
                        )}
                        <span className="text-sm text-gray-500">
              {report.timestamp.toLocaleDateString()}
            </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                        {report.category.charAt(0).toUpperCase() + report.category.slice(1)} Report
                    </h3>

                    <p className="text-gray-700 mb-3">{report.content}</p>

                    {report.media && report.media.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            {report.media.map((mediaUrl, index) => (
                                <Image
                                    key={index}
                                    src={mediaUrl}
                                    alt={`Report media ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="rounded-md object-cover"
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        Lat: {report.location.lat.toFixed(4)}, Lng: {report.location.lng.toFixed(4)}
                    </div>
                </div>
            </div>
        </div>
    );
}