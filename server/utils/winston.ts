import { createLogger, format, transports } from "winston";
import { NODE_ENV } from "../settings/config";

const { prettyPrint } = format;

const logger = createLogger({
  level: "debug",
  format: format.combine(format.json(), prettyPrint()),
  transports: [new transports.Console()],
  silent: NODE_ENV === "test"
});

export default logger;
