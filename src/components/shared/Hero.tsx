import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const Hero = () => {
    const t = useTranslations('hero');

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-dark-2 dark:to-dark-3 py-12 relative">
            <div className="absolute inset-0 bg-grid-gray-100/20 dark:bg-grid-gray-800/10"
                 style={{
                     backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                     backgroundSize: '40px 40px'
                 }}
            />
            <div className="mx-auto max-w-[1170px] px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        {t('title.main')}{' '}
                        <span className="text-primary">{t('title.highlight')}</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-200 mb-8">
                        {t('description')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/reports/new"
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            {t('buttons.submit')}
                        </Link>
                        <Link
                            href="/reports"
                            className="px-6 py-3 bg-white dark:bg-dark-4 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-5 transition-colors"
                        >
                            {t('buttons.browse')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};