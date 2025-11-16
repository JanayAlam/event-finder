import { API_BASE_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";
import { TUserRole, USER_ROLE, userRoles } from "../server/enums/role.enum";
import { COOKIE_KEYS } from "../server/settings/cookies";
import {
  PRIVATE_ADMIN_ONLY_PAGE_ROUTE,
  PRIVATE_PAGE_ROUTE,
  PRIVATE_TRAVELLER_ONLY_PAGE_ROUTE
} from "./routes";

const ADMIN_ONLY_ROUTES: string[] = Object.values(
  PRIVATE_ADMIN_ONLY_PAGE_ROUTE
);
const USER_ONLY_ROUTES: string[] = Object.values(
  PRIVATE_TRAVELLER_ONLY_PAGE_ROUTE
);

const PRIVATE_ROUTES: string[] = [
  ...Object.values(PRIVATE_PAGE_ROUTE),
  ...ADMIN_ONLY_ROUTES,
  ...USER_ONLY_ROUTES
];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // extract cookies
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

  if (!isLoggedIn && PRIVATE_ROUTES.some((route) => path.startsWith(route))) {
    const backendLoginUrl = `${API_BASE_URL}/auth/login`;
    return NextResponse.redirect(backendLoginUrl);
  }

  if (
    ADMIN_ONLY_ROUTES.some((route) => path.startsWith(route)) &&
    userRole !== USER_ROLE.ADMIN
  ) {
    return NextResponse.redirect(new URL("/403", request.url)); // forbidden page
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
