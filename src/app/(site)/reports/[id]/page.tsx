'use client';
import React from 'react';
import { Post, CategoryReport, ReportStatus, ActivityType } from '@/types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
    MapPin, Calendar, Image as ImageIcon, Tags,
    Share2, Flag, Bell, Clock, CheckCircle2,
    AlertCircle, XCircle, Loader2, MessageSquare,
    ThumbsUp, Building2, Filter
} from 'lucide-react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { useReportDetails } from "@/hooks/useReportDetails";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { SimpleAvatar } from '@/components/ui/SimpleAvatar';
import { Input } from '@/components/ui/Input';


// Status configurations
const statusConfig = {
    [ReportStatus.PENDING]: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: AlertCircle,
        label: 'Pending Review'
    },
    [ReportStatus.IN_PROGRESS]: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Clock,
        label: 'In Progress'
    },
    [ReportStatus.RESOLVED]: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2,
        label: 'Resolved'
    },
    [ReportStatus.CLOSED]: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: XCircle,
        label: 'Closed'
    }
};

const statusIcons = {
    pending: AlertCircle,
    in_progress: Clock,
    resolved: CheckCircle2,
    closed: XCircle
};

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800",
    resolved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800",
    closed: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
};

const mapContainerStyle = {
    width: '100%',
    height: '200px',
    borderRadius: '0.5rem'
};

const CommentSection = ({ comments }) => {
    const [newComment, setNewComment] = React.useState('');
    
    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment..."
                    className="flex-1"
                />
                <Button>Post</Button>
            </div>
            
            <div className="space-y-4">
                {comments?.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                        <SimpleAvatar name={comment.author} />
                        <div className="flex-1">
                            <div className="bg-gray-50 dark:bg-dark-4 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {comment.author}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {comment.date}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {comment.content}
                                </p>
                            </div>
                            <div className="flex gap-4 mt-1 text-sm">
                                <button className="text-gray-500 hover:text-primary">
                                    <ThumbsUp className="w-4 h-4 inline mr-1" />
                                    {comment.likes}
                                </button>
                                <button className="text-gray-500 hover:text-primary">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AuthorityResponses = ({ responses }) => (
    <div className="space-y-4">
        {responses?.map((response, index) => (
            <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <span className="font-medium text-blue-900 dark:text-blue-200">
                                {response.authority}
                            </span>
                            <Badge variant="secondary">Official Response</Badge>
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                            {response.content}
                        </p>
                        <span className="block mt-2 text-sm text-gray-500">
                            {response.date}
                        </span>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const RelatedReports = ({ reports, currentLocation }) => (
    <div className="space-y-3">
        {reports?.map((report, index) => (
            <Link
                key={index}
                href={`/reports/${report.id}`}
                className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white block mb-1">
                            {report.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {`${report.distance}m away`}
                        </div>
                    </div>
                    <Badge variant={report.status}>
                        {report.status}
                    </Badge>
                </div>
            </Link>
        ))}
    </div>
);

export default function ReportDetailPage({ params }: { params: { id: string } }) {
    const t = useTranslations('reportDetailScreen');
    // @ts-ignore
    const unwrappedParams = React.use(params);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAEe-vcJ-r8w9FQdVEskAozi1v9cWy6YAA",
    });
    // @ts-ignore
    const { report, loading, error } = useReportDetails(unwrappedParams.id);
    const [isFollowing, setIsFollowing] = React.useState(false);

    if (loading) {
        return <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>;
    }

    if (error || !report) {
        return <div className="text-center py-8 text-red-500">
            {error || 'Report not found'}
        </div>;
    }

    const handleShare = async () => {
        try {
            await navigator.share({
                title: report.title,
                text: report.content,
                url: window.location.href
            });
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 pt-[50px] pb-[50px]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4 mb-4">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {report.title}
                                </h1>
                                <div
                                    className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4"/>
                    {new Date(report.createdAt).toLocaleDateString()}
                </span>
                                    <span className="flex items-center gap-1">
                    <Tags className="w-4 h-4"/>
                                        {report.category}
                </span>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full border ${statusColors[report.status]} self-start`}>
                                {React.createElement(statusIcons[report.status], {className: 'w-4 h-4 inline mr-1'})}
                                {report.status}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Quick Actions */}
                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t dark:border-gray-700">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="text-gray-600 dark:text-gray-300 hover:text-primary"
                        >
                            <Share2 className="w-4 h-4 mr-1"/>
                            {t('actions.share')}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 dark:text-gray-300 hover:text-primary"
                        >
                            <Flag className="w-4 h-4 mr-1"/>
                            {t('actions.report')}
                        </Button>

                        <Button
                            variant={isFollowing ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setIsFollowing(!isFollowing)}
                            className="text-gray-600 dark:text-gray-300 hover:text-primary"
                        >
                            <Bell className="w-4 h-4 mr-1"/>
                            {isFollowing ? 'Following' : t('actions.follow')}
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="details" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="updates">Updates</TabsTrigger>
                                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details">
                                {/* Report Content */}
                                <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {report.content}
                                    </p>
                                </div>

                                {/* Media Evidence */}
                                {report.media?.length > 0 && (
                                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4 mt-4">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-primary" />
                                            {t('evidence')}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {report.media.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Evidence ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="updates">
                                <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                                    <AuthorityResponses 
                                        responses={[
                                            {
                                                authority: "City Maintenance Department",
                                                content: "We've received your report and assigned a maintenance team. Expected resolution within 48 hours.",
                                                date: "2 hours ago"
                                            }
                                        ]} 
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="discussion">
                                <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                                    <CommentSection 
                                        comments={[
                                            {
                                                author: "John Doe",
                                                content: "I've noticed this issue too. It's been getting worse over the past week.",
                                                date: "1 hour ago",
                                                likes: 5
                                            }
                                        ]}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Location Map */}
                            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    {t('location')}
                                </h3>
                                {isLoaded && (
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        zoom={15}
                                        center={report.location}
                                    >
                                        <MarkerF position={report.location} />
                                    </GoogleMap>
                                )}
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {`${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                                <h3 className="text-lg font-semibold mb-3">
                                    {t('reportMetadata')}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{t('reportId')}:</span>
                                        <span className="font-medium">{report.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{t('accuracy')}:</span>
                                        <span className="font-medium">{report.location.accuracy}m</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{t('anonymous')}:</span>
                                        <span className="font-medium">
                    {report.isAnonymous ? t('anonymousYes') : t('anonymousNo')}
                </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Enhanced Related Reports */}
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold">
                                    {t('relatedReports')}
                                </h3>
                                <Button variant="ghost" size="sm">
                                    <Filter className="w-4 h-4 mr-1" />
                                    Filter
                                </Button>
                            </div>
                            <RelatedReports 
                                reports={[
                                    {
                                        id: "1",
                                        title: "Similar infrastructure issue",
                                        status: "pending",
                                        distance: 250
                                    }
                                ]}
                                currentLocation={report.location}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
