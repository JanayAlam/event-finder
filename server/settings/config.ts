export const NODE_ENV = process.env.NODE_ENV;
export const PORT: number = parseInt(process.env.PORT || "8000");

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

export const MAIL_SENDER = process.env.MAIL_SENDER || "admin@bhalothaki.com";

export const SSL_SMS_SEND_API = process.env.SSL_SMS_SEND_API;
export const SSL_API_TOKEN = process.env.SSL_API_TOKEN;
export const SSL_SID = process.env.SSL_SID;

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_ACCESS_SECRET_KEY = process.env.AWS_ACCESS_SECRET_KEY;
export const AWS_REGION = process.env.AWS_REGION;

export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;
