"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Report, CategoryReport, ReportStatus } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';
import { Hero } from '@/components/shared/Hero';
import Link from 'next/link';
import { ChevronRight, ArrowRight, CheckCircle2, MapPin, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const featuredReports = Array.from({ length: 9 }, (_, i) => ({
    id: `${i}`,
    title: `Report #${i}`,
    content: `This is a sample report about ${['roads', 'parks', 'lighting', 'trash', 'water', 'electricity', 'sidewalks', 'noise', 'pollution'][i]} that needs attention...`,
    category: Object.values(CategoryReport)[i % 4],
    isAnonymous: false,
    author: `User ${i}`,
    location: {
        lat: 41.3275 + (Math.random() - 0.5) * 0.1,
        lng: 19.8187 + (Math.random() - 0.5) * 0.1,
        accuracy: 10
    },
    media: [`https://picsum.photos/200/200?random=${i}`],
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
    updatedAt: new Date(),
    status: Object.values(ReportStatus)[i % 4]
}));

const FaqItem = ({ faq, isActive, onToggle }) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                className="flex w-full items-center justify-between py-4 text-left"
                onClick={onToggle}
            >
                <span className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <ChevronRight className={`w-5 h-5 transform transition-transform ${isActive ? 'rotate-90' : ''}`} />
            </button>
            <div className={`pb-4 transition-all duration-300 ${isActive ? 'block' : 'hidden'}`}>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </div>
        </div>
    );
};

export default function HomePage() {
    const t = useTranslations('home');
    const [activeFaq, setActiveFaq] = useState(1);

    const faqData = [
        {
            id: 1,
            question: t('faq.howToReport.question'),
            answer: t('faq.howToReport.answer')
        },
        {
            id: 2,
            question: t('faq.timeToResolve.question'),
            answer: t('faq.timeToResolve.answer')
        },
        {
            id: 3,
            question: t('faq.anonymous.question'),
            answer: t('faq.anonymous.answer')
        },
        {
            id: 4,
            question: t('faq.tracking.question'),
            answer: t('faq.tracking.answer')
        }
    ];

    return (
        <div className="min-h-screen">
            <Hero />

            {/* Featured Reports Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">


                        <div className="mb-8">
                            {/* Header with title and description */}
                            <div className="mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t('featured.title')}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {t('featured.subtitle')}
                                    </p>
                            </div>
                                {/* View All Link - On mobile appears below description, on desktop appears to the right */}
                                <Link
                                    href="/reports"
                                    className="inline-flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:absolute sm:top-0 sm:right-4"
                                >
                                    {t('featured.viewAll')}
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6"/>
                                    </svg>
                                </Link>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredReports.map(report => (
                                <ReportCard key={report.id} report={report}/>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/reports" className="inline-flex items-center">
                            <Button size="lg" className="gap-2">
                                {t('featured.exploreAll')}
                                <ArrowRight className="w-4 h-4"/>
                            </Button>
                        </Link>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {t('featured.feedDescription')}
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        {t('howItWorks.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['report', 'verify', 'resolve'].map((step, index) => (
                            <div key={step} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {t(`howItWorks.steps.${step}.title`)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t(`howItWorks.steps.${step}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                            {t('faq.title')}
                        </h2>
                        <div className="space-y-4">
                            {faqData.map(faq => (
                                <FaqItem
                                    key={faq.id}
                                    faq={faq}
                                    isActive={activeFaq === faq.id}
                                    onToggle={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">2,500+</div>
                            <p className="text-gray-600 dark:text-gray-400">{t('stats.reportsSubmitted')}</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <Users className="w-8 h-8 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">10,000+</div>
                            <p className="text-gray-600 dark:text-gray-400">{t('stats.activeUsers')}</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                            <BarChart3 className="w-8 h-8 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">85%</div>
                            <p className="text-gray-600 dark:text-gray-400">{t('stats.resolutionRate')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}