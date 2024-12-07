import type { useTranslations } from 'next-intl';

export type Messages = {
    reports: {
        title: string;
        description: string;
        form: {
            title: string;
            description: string;
            fields: {
                title: {
                    label: string;
                    placeholder: string;
                };
                category: {
                    label: string;
                    placeholder: string;
                };
                description: {
                    label: string;
                    placeholder: string;
                };
                evidence: {
                    label: string;
                    upload: {
                        text: string;
                        specs: string;
                    };
                    voice: {
                        start: string;
                        stop: string;
                    };
                };
                anonymous: string;
            };
            submit: string;
            submitting: string;
            error: string;
        };
    };
    emergency: {
        title: string;
        call: string;
    };
    account: {
        benefits: {
            title: string;
            description: string;
            features: {
                tracking: string;
                updates: string;
            };
            cta: string;
        };
    };
    privacy: {
        title: string;
        description: string;
        features: {
            noInfo: string;
            noIp: string;
            location: string;
            metadata: string;
        };
    };
    recentReports: {
        title: string;
        timeAgo: string;
        sample: string;
        viewAll: string;
    };
    impact: {
        title: string;
        stats: {
            monthly: string;
            resolved: string;
            response: string;
        };
    };
};

// Type guard function for translation
export function getTranslation<K extends keyof Messages>(
    t: ReturnType<typeof useTranslations>,
    namespace: K
): Messages[K] {
    return {
        ...Object.fromEntries(
            Object.keys(t).map(key => [key, t(key)])
        )
    } as Messages[K];
}