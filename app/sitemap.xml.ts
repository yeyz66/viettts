import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.viettts.com';
  
  // Create a function to generate urls for each locale
  const generateLocaleUrls = (path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly') => {
    const locales = ['', 'vi', 'zh']; // '' represents default (en)
    
    return locales.map(locale => ({
      url: `${baseUrl}${locale ? `/${locale}` : ''}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority: locale === 'vi' && path.includes('text-to-speech') ? priority + 0.1 : priority,
    }));
  };
  
  return [
    // Home pages
    ...generateLocaleUrls('', 1, 'weekly'),
    
    // Text-to-speech pages (higher priority for Vietnamese)
    ...generateLocaleUrls('/text-to-speech', 0.9, 'weekly'),
    
    // Other pages
    ...generateLocaleUrls('/how-it-works', 0.8, 'monthly'),
    ...generateLocaleUrls('/pricing', 0.8, 'monthly'),
    ...generateLocaleUrls('/faq', 0.7, 'monthly'),
  ];
} 