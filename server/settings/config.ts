export const NODE_ENV: string = process.env.NODE_ENV;
export const PORT: number = parseInt(process.env.PORT || "8000");

export const ADMIN_JWT_SECRET: string =
  process.env.ADMIN_JWT_SECRET || "admin-secret";
export const CUSTOMER_JWT_SECRET: string =
  process.env.CUSTOMER_JWT_SECRET || "secret";

export const ADMIN_ACCESS_TOKEN_EXPIRATION_TIME_SECOND: number = parseInt(
  process.env.ADMIN_ACCESS_TOKEN_EXPIRATION_TIME_SECOND || "900"
);
export const ADMIN_REFRESH_TOKEN_EXPIRATION_TIME_SECOND: number = parseInt(
  process.env.ADMIN_REFRESH_TOKEN_EXPIRATION_TIME_SECOND || "21600"
);

export const CUSTOMER_ACCESS_TOKEN_EXPIRATION_TIME_SECOND: number = parseInt(
  process.env.CUSTOMER_ACCESS_TOKEN_EXPIRATION_TIME_SECOND || "900"
);
export const CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME_SECOND: number = parseInt(
  process.env.CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME_SECOND || "21600"
);

export const SMTP_HOST: string =
  process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
export const SMTP_PORT: number = parseInt(process.env.SMTP_PORT || "2525");
export const SMTP_USER: string = process.env.SMTP_USER || "";
export const SMTP_PASS: string = process.env.SMTP_PASS || "";

export const MAIL_SENDER: string =
  process.env.MAIL_SENDER || "admin@bhalothaki.com";

export const SSL_SMS_SEND_API: string | undefined =
  process.env.SSL_SMS_SEND_API;
export const SSL_API_TOKEN: string | undefined = process.env.SSL_API_TOKEN;
export const SSL_SID: string | undefined = process.env.SSL_SID;
