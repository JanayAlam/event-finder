import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { upsertUser } from "../../../../services/user";
import {
  KINDE_CLIENT_ID,
  KINDE_CLIENT_SECRET,
  KINDE_DOMAIN,
  KINDE_REDIRECT_URI,
  PUBLIC_SERVER_URL
} from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";

export const kindeCallbackController = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const returnedState = req.query.state as string | undefined;
  const storedState = req.cookies?.[COOKIE_KEYS.oauthState] as
    | string
    | undefined;

  if (!code) {
    res.status(400).send("Missing code");
    return;
  }

  if (!returnedState || !storedState || returnedState !== storedState) {
    res.status(400).send("Invalid state");
    return;
  }

  const tokenResponse = await fetch(`${KINDE_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: KINDE_REDIRECT_URI,
      client_id: KINDE_CLIENT_ID,
      client_secret: KINDE_CLIENT_SECRET
    })
  });

  const tokens = await tokenResponse.json();
  const { access_token, refresh_token, id_token } = tokens as any;

  const decoded = jwt.decode(id_token) as any;
  const { sub, email } = decoded;

  const user = await upsertUser({
    kindeId: sub,
    email
  });

  res.cookie(COOKIE_KEYS.authAccessToken, access_token, cookieOptions);
  res.cookie(COOKIE_KEYS.authRefreshToken, refresh_token, cookieOptions);
  res.cookie(
    COOKIE_KEYS.authUser,
    JSON.stringify({ id: user._id, email: user.email, role: user.role }),
    cookieOptions
  );

  res.cookie(COOKIE_KEYS.oauthState, "", {
    ...cookieOptions,
    maxAge: 0,
    path: "/"
  });

  res.redirect(`${PUBLIC_SERVER_URL}/`);
};
