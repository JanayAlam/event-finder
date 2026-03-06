import cron from "node-cron";
import { EVENT_STATUS } from "../enums";
import Event from "../models/event.model";
import logger from "../utils/winston.util";

export const startEventCronJobs = () => {
  // Run every day at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await Event.updateMany(
        {
          eventDate: { $lt: new Date() },
          $or: [
            { status: EVENT_STATUS.OPEN },
            { status: { $exists: false } },
            { status: null }
          ]
        },
        { $set: { status: EVENT_STATUS.FINISHED } }
      );
      if (result.modifiedCount > 0) {
        logger.info(`Auto-finished ${result.modifiedCount} passed events`);
      }
    } catch (error) {
      logger.error(`Error in event auto-finish cronjob: ${error}`);
    }
  });
  logger.info("Event cron jobs initialized");
};
