import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const adminRoutes = ['/users'];
const protectedRoutes = ['/admin', '/users']; // Все защищенные маршруты

export async function middleware(request: NextRequest) {
  // 1. Настройка для продакшена
  const isProduction = process.env.NODE_ENV === 'production';
  const secureCookie = isProduction;
  const cookieName = isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token';

  // 2. Получаем токен с правильными настройками
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
    cookieName,
  });

  // 3. Получаем sessionToken с учетом окружения
  const sessionToken = request.cookies.get(cookieName)?.value;
  const { pathname } = request.nextUrl;

  // 4. Проверки доступа
  const isAuth = !!sessionToken;
  const isLoginPage = pathname === '/login';
  const isPublicPage = pathname === '/' || isLoginPage || pathname === '/unauthorized';
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  console.log({
    pathname,
    isAuth,
    tokenRole: token?.role,
    isAdminRoute,
    isProduction,
    cookieName,
    sessionToken: !!sessionToken,
  });

  // 5. Правила редиректов
  if (!isAuth && !isPublicPage) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 6. Проверка прав администратора (исправленная)
  if (isAdminRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // 7. Проверка защищенных маршрутов
  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|fonts|api|auth|error|403).*)'],
};
