"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Report } from '@/types';
import { ReportCard } from '@/components/shared/ReportCard';
import { Hero } from '@/components/shared/Hero';
import Link from 'next/link';
import {
    ChevronRight, ArrowRight, CheckCircle2, MapPin,
    Users, BarChart3, Loader2, Search, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useFeaturedReports } from "@/hooks/useFeaturedReports";

const FaqItem = ({ faq, isActive, onToggle }) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                className="flex w-full items-center justify-between py-4 text-left"
                onClick={onToggle}
            >
                <span className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <ChevronRight className={`w-5 h-5 transform transition-transform text-gray-500 dark:text-gray-400 ${isActive ? 'rotate-90' : ''}`} />
            </button>
            <div className={`pb-4 transition-all duration-300 ${isActive ? 'block' : 'hidden'}`}>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </div>
        </div>
    );
};

// Categories/tags in Featured Reports section
const CategoryFilter = ({ categories, selectedCategories, onToggle }) => (
    <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
            <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ?
                    "default" :
                    "outline"}
                className={`cursor-pointer transition-colors ${
                    selectedCategories.includes(category.id) ?
                        'bg-primary text-white hover:bg-primary/90' :
                        'border-[1.5px] border-gray-200/90 dark:border-gray-700/60 bg-transparent dark:text-white hover:bg-gray-100 dark:hover:bg-dark-4'
                }`}
                onClick={() => onToggle(category.id)}
            >
                {category.name}
            </Badge>
        ))}
    </div>
);

const ReportGroup = ({ title, reports }) => {
    if (!reports?.length) return null;

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <Badge variant="secondary" className="dark:bg-dark-4 dark:text-gray-300">
                    {reports.length}
                </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map(report => (
                    <ReportCard key={report.id} report={report} />
                ))}
            </div>
        </div>
    );
};

const FeaturedReportsSection = () => {
    const t = useTranslations('home');
    const { featuredReports, loading, error } = useFeaturedReports();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        { id: 1, name: 'Infrastructure' },
        { id: 2, name: 'Safety' },
        { id: 3, name: 'Environment' },
        { id: 4, name: 'Public Services' },
        { id: 5, name: 'Transportation' }
    ];

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const filteredReports = featuredReports
        .filter(report =>
            (searchTerm === '' ||
                report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategories.length === 0 ||
                // @ts-ignore
                selectedCategories.includes(report.categoryId))
        );

    const groupedReports = {
        today: filteredReports.filter(report =>
            new Date(report.createdAt).toDateString() === new Date().toDateString()
        ),
        thisWeek: filteredReports.filter(report => {
            const reportDate = new Date(report.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return reportDate > weekAgo && reportDate.toDateString() !== new Date().toDateString();
        }),
        earlier: filteredReports.filter(report => {
            const reportDate = new Date(report.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return reportDate <= weekAgo;
        })
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) return null;

    return (
        <section className="py-16 bg-gray-50 dark:bg-dark-2">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('featured.title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t('featured.subtitle')}
                            </p>
                        </div>
                        <Link
                            href="/reports"
                            className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-white dark:bg-dark-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-4"
                        >
                            {t('featured.viewAll')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder={t('search.placeholder')}
                                className="pl-10 bg-white dark:bg-dark-3 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CategoryFilter
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onToggle={toggleCategory}
                        />
                    </div>
                </div>

                <ReportGroup title={t('reports.today')} reports={groupedReports.today} />
                <ReportGroup title={t('reports.thisWeek')} reports={groupedReports.thisWeek} />
                <ReportGroup title={t('reports.earlier')} reports={groupedReports.earlier} />

                <div className="mt-8 text-center">
                    <Link href="/reports">
                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            {t('featured.exploreAll')}
                            <ArrowRight className="w-4 h-4"/>
                        </span>
                    </Link>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('featured.feedDescription')}
                    </p>
                </div>
            </div>

            <Link href="/reports/new">
                <button className="group fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                    <span className="absolute -inset-1 rounded-full bg-primary animate-ping opacity-75 group-hover:opacity-0"></span>
                    {/* Tooltip */}
                    <span className="absolute right-full mr-4 px-2 py-1 bg-gray-900 dark:bg-dark-4 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
     Submit a Report
   </span>
                </button>
            </Link>
        </section>
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
        <div className="min-h-screen bg-white dark:bg-dark-2">
            <Hero />

            <FeaturedReportsSection />

            <section className="py-16 dark:bg-dark-3">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        {t('howItWorks.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['report', 'verify', 'resolve'].map((step) => (
                            <div key={step} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-primary dark:text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    {t(`howItWorks.steps.${step}.title`)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {t(`howItWorks.steps.${step}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50 dark:bg-dark-2">
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

            <section className="py-16 dark:bg-dark-3">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg bg-white dark:bg-dark-4 shadow-sm">
                            <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">2,500+</div>
                            <p className="text-gray-600 dark:text-gray-300">{t('stats.reportsSubmitted')}</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-white dark:bg-dark-4 shadow-sm">
                            <Users className="w-8 h-8 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">10,000+</div>
                            <p className="text-gray-600 dark:text-gray-300">{t('stats.activeUsers')}</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-white dark:bg-dark-4 shadow-sm">
                            <BarChart3 className="w-8 h-8 mx-auto mb-4 text-primary" />
                            <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">85%</div>
                            <p className="text-gray-600 dark:text-gray-300">{t('stats.resolutionRate')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
