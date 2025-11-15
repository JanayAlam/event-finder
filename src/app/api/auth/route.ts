import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from "../../../../server/settings/cookies";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_KEYS.authAccessToken)?.value;
  const refreshToken = request.cookies.get(COOKIE_KEYS.authRefreshToken)?.value;
  const userCookie = request.cookies.get(COOKIE_KEYS.authUser)?.value;

  if (!accessToken || !refreshToken || !userCookie) {
    return NextResponse.json(
      { isLoggedIn: false, user: null, accessToken: null, refreshToken: null },
      { status: 200 }
    );
  }

  let user = null;
  try {
    user = JSON.parse(userCookie);
  } catch {
    return NextResponse.json(
      { isLoggedIn: false, user: null, accessToken: null, refreshToken: null },
      { status: 200 }
    );
  }

  return NextResponse.json({
    isLoggedIn: true,
    user,
    accessToken,
    refreshToken
  });
}
