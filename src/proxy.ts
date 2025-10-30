import { NextRequest, NextResponse } from "next/server";
import { TUserRole, userRoles } from "../server/enums/role.enum";
import { COOKIE_KEYS } from "../server/settings/cookies";

const ADMIN_ONLY_ROUTES: string[] = ["/admin", "/admin/settings"];
const USER_ONLY_ROUTES: string[] = ["/dashboard", "/profile"];
const AUTH_COMMON_ROUTES: string[] = ["/orders", "/account"];

const PRIVATE_ROUTES: string[] = [
  ...AUTH_COMMON_ROUTES,
  ...ADMIN_ONLY_ROUTES,
  ...USER_ONLY_ROUTES
];

const AUTH_ROUTES = ["/login", "/register"];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Extract cookies
  const accessToken = request.cookies.get(COOKIE_KEYS.authAccessToken)?.value;
  const refreshToken = request.cookies.get(COOKIE_KEYS.authRefreshToken)?.value;
  const userCookie = request.cookies.get(COOKIE_KEYS.authUser)?.value;

  const isLoggedIn = accessToken && refreshToken && userCookie;
  let userRole: TUserRole | null = null;

  try {
    userRole = userCookie ? JSON.parse(userCookie).role : null;
  } catch {
    userRole = null;
  }

  if (isLoggedIn && AUTH_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLoggedIn && PRIVATE_ROUTES.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    ADMIN_ONLY_ROUTES.some((route) => path.startsWith(route)) &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/403", request.url)); // Forbidden page
  }

  if (
    USER_ONLY_ROUTES.some((route) => path.startsWith(route)) &&
    !userRoles.includes(userRole as TUserRole)
  ) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
    }
  ]
};
