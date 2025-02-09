import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from "../server/settings/cookies";

const SUPER_ADMIN_ONLY_ROUTES: string[] = [];

const OUTLET_ADMIN_ONLY_ROUTES: string[] = [
  "/outlet-admin",
  "/outlet-admin/dashboard"
];

const CUSTOMER_ONLY_ROUTES: string[] = [];

const AUTH_COMMON_ROUTES: string[] = [];

const PRIVATE_ROUTES: string[] = [
  ...SUPER_ADMIN_ONLY_ROUTES,
  ...OUTLET_ADMIN_ONLY_ROUTES,
  ...AUTH_COMMON_ROUTES,
  ...CUSTOMER_ONLY_ROUTES
];

const AUTH_ROUTES = ["/login", "/admin/login"];

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const authAccessToken = request.cookies.get(
    COOKIE_KEYS.authAccessToken
  )?.value;
  const authRefreshToken = request.cookies.get(
    COOKIE_KEYS.authRefreshToken
  )?.value;
  const authUser = request.cookies.get(COOKIE_KEYS.authUser)?.value;

  const isLoggedIn = authAccessToken && authRefreshToken && authUser;

  if (isLoggedIn && AUTH_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLoggedIn && PRIVATE_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }]
    }
  ]
};
