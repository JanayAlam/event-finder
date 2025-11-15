import { API_BASE_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";
import { TUserRole, userRoles } from "../server/enums/role.enum";
import { COOKIE_KEYS } from "../server/settings/cookies";

const ADMIN_ONLY_ROUTES: string[] = [];
const USER_ONLY_ROUTES: string[] = [];
const AUTH_COMMON_ROUTES: string[] = [];

const PRIVATE_ROUTES: string[] = [
  ...AUTH_COMMON_ROUTES,
  ...ADMIN_ONLY_ROUTES,
  ...USER_ONLY_ROUTES
];

const AUTH_ROUTES = ["/login"];

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
    const backendLoginUrl = `${API_BASE_URL}/auth/login`;
    return NextResponse.redirect(backendLoginUrl);
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
