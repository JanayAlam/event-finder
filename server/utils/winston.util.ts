import { createLogger, format, transports } from "winston";
import { Loggly } from "winston-loggly-bulk";
import {
  LOGGLY_SUBDOMAIN,
  LOGGLY_TAG,
  LOGGLY_TOKEN,
  NODE_ENV
} from "../settings/config";

const { prettyPrint, timestamp } = format;

const allTransports: any[] = [new transports.Console()];

if (LOGGLY_SUBDOMAIN && LOGGLY_TOKEN) {
  allTransports.push(
    new Loggly({
      subdomain: LOGGLY_SUBDOMAIN,
      token: LOGGLY_TOKEN,
      tags: [LOGGLY_TAG],
      json: true
    })
  );
}

const logger = createLogger({
  level: "debug",
  format: format.combine(
    timestamp({
      format: "DD-MM-YYYY HH:mm:ss"
    }),
    format.json(),
    prettyPrint()
  ),
  transports: allTransports,
  silent: NODE_ENV === "test"
});

export default logger;
