import axios from "axios";
import jwksClient from "jwks-rsa";
import {
  KINDE_CLIENT_ID,
  KINDE_CLIENT_SECRET,
  KINDE_DOMAIN,
  KINDE_REDIRECT_URI
} from "../../settings/config";
import ApiError from "../../utils/api-error";

export const getKindePublicKey = (header: any, callback: any) => {
  const client = jwksClient({
    jwksUri: `${KINDE_DOMAIN}/.well-known/jwks.json`
  });

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    if (!key) {
      return callback(new Error("Unable to find signing key"));
    }
    try {
      const publicKey = key.getPublicKey();
      callback(null, publicKey);
    } catch (error) {
      callback(error);
    }
  });
};

export const getAuthorizationUrl = (state: string) => {
  const queryParams = new URLSearchParams({
    client_id: KINDE_CLIENT_ID,
    redirect_uri: KINDE_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email offline",
    state,
    prompt: "login"
  });

  return `${KINDE_DOMAIN}/oauth2/auth?${queryParams.toString()}`;
};

export const getAuthorizationTokens = async (code: string) => {
  try {
    const { data } = await axios.post(
      `${KINDE_DOMAIN}/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: KINDE_REDIRECT_URI,
        client_id: KINDE_CLIENT_ID,
        client_secret: KINDE_CLIENT_SECRET
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return {
      idToken: data.id_token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  } catch {
    throw new ApiError(401, "Failed to generate authorization tokens");
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const { data } = await axios.post(
      `${KINDE_DOMAIN}/oauth2/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: KINDE_CLIENT_ID!,
        client_secret: KINDE_CLIENT_SECRET!,
        refresh_token: refreshToken
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return {
      idToken: data.id_token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  } catch {
    throw new ApiError(401, "Failed to refresh token");
  }
};
