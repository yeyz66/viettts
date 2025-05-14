export const locales = ['en', 'zh', 'vi'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localePrefix = 'always' as const; // Or 'always' or 'never'

export function getDirection() {
  return 'ltr';
} 