import http from "node:http";
import app from "./app";
import { PORT } from "./settings/config";
import logger from "./utils/winston";

const server = http.createServer(app);

const main = async () => {
  try {
    await server.listen(PORT);

    logger.info(`Server is running on port ${PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

main();
