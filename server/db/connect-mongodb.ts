import mongoose from "mongoose";
import { DB_URL } from "../settings/config";
import logger from "../utils/winston";

const connectMongoDB = async () => {
  await mongoose.connect(DB_URL, { autoIndex: false });

  const db = mongoose.connection;

  db.on("close", () => {
    logger.info("Mongoose default connection closed");
  });

  db.on("disconnected", () => {
    logger.info("Mongoose default connection disconnected");
  });

  db.on("error", (err) => {
    logger.error("Mongoose connection error:", err);
  });
};

export default connectMongoDB;
