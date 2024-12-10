"use client";
import { useTranslations } from 'next-intl';
import { ReportFormMain } from './ReportFormMain';
import { Button } from '@/components/ui/Button';
import {Phone, Shield, User, Clock, LockKeyhole, Plus} from 'lucide-react';
import Link from 'next/link';
import ReportChatbot from "../../components/ReportChatbot";
import {useState} from "react";

export const ReportForm = () => {
    const tReports = useTranslations('reports');
    const tEmergency = useTranslations('emergency');
    const tAccount = useTranslations('account.benefits');
    const tPrivacy = useTranslations('privacy');
    const tRecentReports = useTranslations('recentReports');
    const tImpact = useTranslations('impact');
    const [showReportModal, setShowReportModal] = useState(false);


    return (
        <div className="pt-[50px] pb-[50px]">
            {/* Title Section */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {tReports('title')}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-white">
                    {tReports('description')}
                </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Emergency Contact */}
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                            <Phone className="w-5 h-5" />
                            <h2 className="font-semibold">{tEmergency('title')}</h2>
                        </div>
                        <a href="tel:129" className="mt-2 inline-block text-2xl font-bold text-red-700 dark:text-red-300">
                            {tEmergency('call')}
                        </a>
                    </div>

                    {/* Account Benefits */}
                    {/* Account Benefits */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center gap-3 text-blue-700 dark:text-blue-100">
                            <Shield className="w-5 h-5" />
                            <h2 className="font-semibold">{tAccount('title')}</h2>
                        </div>
                        <p className="mt-2 text-sm text-blue-600 dark:text-blue-100">
                            {tAccount('description')}
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-blue-600 dark:text-blue-100">
                            <li className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {tAccount('features.tracking')}
                            </li>
                            <li className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {tAccount('features.updates')}
                            </li>
                        </ul>
                        <Link
                            href="/auth/signup"
                            className="mt-4 inline-block text-blue-600 dark:text-blue-100 hover:underline"
                        >
                            {tAccount('cta')}
                        </Link>
                    </div>

                    {/* Anonymous Reporting Info */}
                    <div
                        className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <LockKeyhole className="w-5 h-5 dark:text-white"/>
                            <h2 className="font-semibold dark:text-white">{tPrivacy('title')}</h2>
                        </div>
                        <div className="mt-2 text-sm space-y-2 dark:text-white">
                            <p>{tPrivacy('description')}</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li>{tPrivacy('features.noInfo')}</li>
                                <li>{tPrivacy('features.noIp')}</li>
                                <li>{tPrivacy('features.location')}</li>
                                <li>{tPrivacy('features.metadata')}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Form - Center */}
                <div className="xl:col-span-6">
                    <ReportFormMain/>
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Recent Reports */}
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                        <h2 className="font-semibold mb-4 dark:text-white">{tRecentReports('title')}</h2>
                        <div className="space-y-3">
                            {[1, 2, 3].map((_, i) => (
                                <div
                                    key={i}
                                    className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm"
                                >
                                    <div className="font-medium dark:text-white">{tRecentReports('sample')}</div>
                                    <div className="text-xs text-gray-500 dark:text-white/80">
                                        {tRecentReports('timeAgo')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/reports"
                            className="mt-4 inline-block text-sm text-primary hover:underline"
                        >
                            {tRecentReports('viewAll')}
                        </Link>
                    </div>

                    {/* Statistics or Additional Info */}
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                        <h2 className="font-semibold mb-4 dark:text-white">{tImpact('title')}</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between dark:text-white">
                                <span>{tImpact('stats.monthly')}</span>
                                <span className="font-medium">124</span>
                            </div>
                            <div className="flex justify-between dark:text-white">
                                <span>{tImpact('stats.resolved')}</span>
                                <span className="font-medium">89</span>
                            </div>
                            <div className="flex justify-between dark:text-white">
                                <span>{tImpact('stats.response')}</span>
                                <span className="font-medium">48h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Add just these two at the end: */}
            <Button
                onClick={() => setShowReportModal(true)}
                className="group fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center z-40"
            >
                <Plus className="w-6 h-6" />
                <span className="absolute -inset-1 rounded-full bg-primary animate-ping opacity-75 pointer-events-none"></span>
            </Button>

            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-2xl">
                        <ReportChatbot onClose={() => setShowReportModal(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};