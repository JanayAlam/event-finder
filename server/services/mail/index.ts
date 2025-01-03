import nodemailer from "nodemailer";
import {
  MAIL_SENDER,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER
} from "../../settings/config";
import logger from "../../utils/winston";

const mailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

export interface IMailTemplate {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendMail = async (mailTemplate: IMailTemplate) => {
  if (!mailTemplate.from) {
    mailTemplate.from = MAIL_SENDER;
  }

  try {
    await mailTransporter.sendMail(mailTemplate);
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
};
