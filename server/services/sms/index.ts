import axios from "axios";
import {
  SSL_API_TOKEN,
  SSL_SID,
  SSL_SMS_SEND_API
} from "../../settings/config";
import logger from "../../utils/winston";

export const sendSMS = async (
  recipient: string,
  text: string,
  csmsId: string
) => {
  if (!SSL_SMS_SEND_API || !SSL_API_TOKEN || !SSL_SID) {
    logger.error("SSL configuration required");
    return false;
  }

  try {
    await axios.post(SSL_SMS_SEND_API, {
      api_token: SSL_API_TOKEN,
      sid: SSL_SID,
      sms: text,
      msisdn: recipient,
      csms_id: csmsId
    });
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
};
