export const NODE_ENV = process.env.NODE_ENV;
export const PORT: number = parseInt(process.env.PORT || "5000");

export const LOGGLY_SUBDOMAIN = process.env.LOGGLY_SUBDOMAIN;
export const LOGGLY_TOKEN = process.env.LOGGLY_TOKEN;
export const LOGGLY_TAG = process.env.LOGGLY_TAG || "Winston-NodeJS";

export const DB_URL =
  process.env.DB_URL ??
  "mongodb+srv://<db_username>:<db_password>@<cluster_name>.ahemwpn.mongodb.net/tripmate";

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

export const SMTP_HOST = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
export const SMTP_PORT: number = parseInt(process.env.SMTP_PORT || "2525");
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";

export const MAIL_SENDER = process.env.MAIL_SENDER || "admin@tripmate.com";

export const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;
