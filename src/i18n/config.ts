export const locales = ['en', 'ru' , 'ar'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];