import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './app/i18n/config'; // Adjust path if needed

// Define pathnames, even if they are the same across locales for now
const pathnames = {
  // The path for the login page
  '/login': '/login',
  // Add other paths here if they differ across locales or need explicit mapping
};

// Base next-intl middleware for handling locales
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix, // Use the localePrefix configuration
  pathnames,    // Add the pathnames configuration
  // localeDetection: false, // Optional: Disable auto-detection if you only want path-based locales
});

export const config = {
  // Simplest matcher: Match all paths except for static assets and API routes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).+)']
}; 