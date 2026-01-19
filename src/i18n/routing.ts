// i18n/routing
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'ru', 'ar'],
    defaultLocale: 'en',
    localePrefix: 'always'
});