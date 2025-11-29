import http from "node:http";
import app from "./app";
import { connectMongoDB } from "./db";
import { PORT } from "./settings/config";
import logger from "./utils/winston.util";

const server = http.createServer(app);

const main = async () => {
  try {
    // connect mongodb
    await connectMongoDB();
    logger.info("MongoDB connected");

    // listening to the server
    await server.listen(PORT);

    logger.info(`Server is running on port ${PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

main();
