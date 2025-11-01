import { PUBLIC_SERVER_URL } from "@/config";
import { NextResponse } from "next/server";
import { COOKIE_KEYS } from "../../../../../server/settings/cookies";

export async function POST() {
  const response = NextResponse.redirect(
    new URL("/login", PUBLIC_SERVER_URL),
    302
  );

  Object.values(COOKIE_KEYS).forEach((key) => {
    response.cookies.set(key, "", { maxAge: 0, path: "/" });
  });

  return response;
}
