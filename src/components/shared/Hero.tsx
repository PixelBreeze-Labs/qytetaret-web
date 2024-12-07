import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const Hero = () => {
    const t = useTranslations('hero');

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[#151F34] dark:to-[#1a2642] py-12"> {/* Changed py-16 to py-12 and removed mb-12 */}
            <div className="mx-auto max-w-[1170px] px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {t('title.main')}
                        <span className="text-primary"> {t('title.highlight')}</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        {t('description')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/reports/new"
                            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                        >
                            {t('buttons.submit')}
                        </Link>
                        <Link
                            href="/reports"
                            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('buttons.browse')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};