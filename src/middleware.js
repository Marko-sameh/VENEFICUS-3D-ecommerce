import { NextResponse } from 'next/server';

const locales = ['en', 'it'];
const defaultLocale = 'en';

// Protected routes that require authentication
const protectedRoutes = ['/account', '/profile', '/orders', '/settings', '/addresses'];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // If no locale and not an excluded path, redirect to default locale
  if (!pathnameHasLocale && pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Check if the route is protected (account pages)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.includes(route)
  );

  if (isProtectedRoute) {
    // Check for authentication token in cookies or headers
    const token = request.cookies.get('veneficus_token')?.value;
    
    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|locales|images|models|icon.png|robots.txt|sitemap.xml).*)',
  ],
};