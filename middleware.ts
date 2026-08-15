import createMiddleware from 'next-intl/middleware';
export default createMiddleware({
  locales: ['en','es','fr','de','pt','ar','hi','zh','ja'],
  defaultLocale: 'en',
  localePrefix: 'never'
});
export const config = { matcher: ['/((?!api|_next|.*\..*).*)'] };
