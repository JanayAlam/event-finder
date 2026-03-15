export const NODE_ENV = process.env.NODE_ENV;
export const PORT: number = parseInt(process.env.PORT || "5000");

export const DB_URL =
  process.env.DB_URL ??
  "mongodb+srv://<db_username>:<db_password>@<cluster_name>.ahemwpn.mongodb.net/event-finder";

export const KINDE_SITE_URL =
  process.env.KINDE_SITE_URL ?? "http://localhost:5000";
export const KINDE_DOMAIN = process.env.KINDE_DOMAIN ?? "";
export const KINDE_CLIENT_ID = process.env.KINDE_CLIENT_ID ?? "";
export const KINDE_CLIENT_SECRET = process.env.KINDE_CLIENT_SECRET ?? "";
export const KINDE_REDIRECT_URI = process.env.KINDE_REDIRECT_URI ?? "";
export const KINDE_LOGOUT_REDIRECT_URI =
  process.env.KINDE_LOGOUT_REDIRECT_URI ?? "";

export const ACCESS_TOKEN_EXPIRY = parseInt(
  process.env.ACCESS_TOKEN_EXPIRY_SEC || "86400",
  10
);
export const REFRESH_TOKEN_EXPIRY = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY_SEC || "1296000",
  10
);

export const PUBLIC_SERVER_URL =
  process.env.PUBLIC_SERVER_URL || "http://localhost:5000";

export const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

export const SSL_COMMERZ_STORE_ID = process.env.SSL_COMMERZ_STORE_ID;
export const SSL_COMMERZ_PASSWORD = process.env.SSL_COMMERZ_PASSWORD;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
