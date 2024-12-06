"use client";
import { useRouter } from 'next/navigation';
import { ReportFormMain } from './ReportFormMain';
import { Phone, Shield, User, Clock, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

export const ReportForm = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Title Section */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Community Issues, Solved Together
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Report local issues anonymously, track their progress, and help make your community better.
                </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Emergency Contact */}
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                            <Phone className="w-5 h-5" />
                            <h2 className="font-semibold">Emergency?</h2>
                        </div>
                        <a href="tel:129" className="mt-2 inline-block text-2xl font-bold text-red-700 dark:text-red-300">
                            Call 129
                        </a>
                    </div>

                    {/* Account Benefits */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                            <Shield className="w-5 h-5" />
                            <h2 className="font-semibold">Track Your Reports</h2>
                        </div>
                        <p className="mt-2 text-sm text-blue-600 dark:text-blue-300">
                            Create an account to:
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-blue-600 dark:text-blue-300">
                            <li className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Track report progress
                            </li>
                            <li className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Get status updates
                            </li>
                        </ul>
                        <Link
                            href="/auth/signup"
                            className="mt-4 inline-block text-blue-600 dark:text-blue-300 hover:underline"
                        >
                            Create an account →
                        </Link>
                    </div>

                    {/* Anonymous Reporting Info */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <LockKeyhole className="w-5 h-5" />
                            <h2 className="font-semibold">Anonymous Reporting</h2>
                        </div>
                        <div className="mt-2 text-sm space-y-2">
                            <p>Your privacy is our priority. When reporting anonymously:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li>No personal information is collected</li>
                                <li>IP addresses are not stored</li>
                                <li>Location data is optional</li>
                                <li>Media is stripped of metadata</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Form - Center */}
                <div className="xl:col-span-6">
                    <ReportFormMain />
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Recent Reports */}
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                        <h2 className="font-semibold mb-4">Recent Reports</h2>
                        <div className="space-y-3">
                            {/* Sample recent reports - replace with real data */}
                            {[1, 2, 3].map((_, i) => (
                                <div
                                    key={i}
                                    className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm"
                                >
                                    <div className="font-medium">Road maintenance needed</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        2 hours ago
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/reports"
                            className="mt-4 inline-block text-sm text-primary hover:underline"
                        >
                            View all reports →
                        </Link>
                    </div>

                    {/* Statistics or Additional Info */}
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown p-4">
                        <h2 className="font-semibold mb-4">Impact</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Reports this month</span>
                                <span className="font-medium">124</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Resolved issues</span>
                                <span className="font-medium">89</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Avg. response time</span>
                                <span className="font-medium">48h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};