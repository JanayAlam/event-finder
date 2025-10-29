export const NODE_ENV = process.env.NODE_ENV;
export const PORT: number = parseInt(process.env.PORT || "8000");

export const LOGGLY_SUBDOMAIN = process.env.LOGGLY_SUBDOMAIN;
export const LOGGLY_TOKEN = process.env.LOGGLY_TOKEN;
export const LOGGLY_TAG = process.env.LOGGLY_TAG || "Winston-NodeJS";

export const ACCESS_TOKEN_JWT_SECRET =
  process.env.ACCESS_TOKEN_JWT_SECRET || "access-secret";
export const REFRESH_TOKEN_JWT_SECRET =
  process.env.REFRESH_TOKEN_JWT_SECRET || "refresh-secret";

export const ACCESS_TOKEN_EXPIRATION_TIME_SECOND: number = parseInt(
  process.env.ACCESS_TOKEN_EXPIRATION_TIME_SECOND || "900"
);
export const REFRESH_TOKEN_EXPIRATION_TIME_SECOND: number = parseInt(
  process.env.REFRESH_TOKEN_EXPIRATION_TIME_SECOND || "21600"
);

export const PUBLIC_SERVER_URL =
  process.env.PUBLIC_SERVER_URL || "http://localhost:5000";
export const NEXT_PUBLIC_LOCAL_SERVER_URL =
  process.env.NEXT_PUBLIC_LOCAL_SERVER_URL || "http://localhost:5000";

export const SMTP_HOST = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
export const SMTP_PORT: number = parseInt(process.env.SMTP_PORT || "2525");
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";

export const MAIL_SENDER = process.env.MAIL_SENDER || "admin@tripmate.com";

export const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;
