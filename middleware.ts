import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const adminRoutes = ['/users'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;
  const { pathname } = request.nextUrl;
  const isAuth = !!sessionToken;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/unauthorized';
  if (!isAuth && !isPublicPage) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
      Match all routes except:
      - static files
      - API routes
      - favicon
    */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|api|error|403).*)',
  ],
};
