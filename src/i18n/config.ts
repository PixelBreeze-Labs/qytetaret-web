export type Locale = (typeof locales)[number];

export const locales = ['en', 'sq'] as const;
export const defaultLocale: Locale = 'en';