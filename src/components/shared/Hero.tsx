import Link from 'next/link';

export const Hero = () => {
    return (
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[#151F34] dark:to-[#1a2642] py-16 mb-12">
            <div className="mx-auto max-w-[1170px] px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Community Issues,
                        <span className="text-primary"> Solved Together</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Report local issues anonymously, track their progress, and help make your community better.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/reports/new"
                            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                        >
                            Submit a Report
                        </Link>
                        <Link
                            href="/reports"
                            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Browse Reports
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};