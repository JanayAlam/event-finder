import { createLogger, format, transports } from "winston";
import { NODE_ENV } from "../settings/config";

const { prettyPrint, timestamp } = format;

const allTransports: any[] = [new transports.Console()];

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
