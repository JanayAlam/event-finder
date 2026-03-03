import "dotenv/config";

import mongoose from "mongoose";
import connectMongoDB from "../db/connect-mongodb";
import { USER_ROLE } from "../enums/role.enum";
import Event from "../models/event.model";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import logger from "../utils/winston.util";
import eventsData from "./data/events.json";

const seedEvents = async () => {
  try {
    logger.info("Connecting to MongoDB...");
    await connectMongoDB();
    logger.info("Connected successfully.");

    // Ensure Profile model is registered
    void Profile;

    // Fetch all users and profiles
    logger.info("Fetching users and profiles...");

    const users = await User.find({ role: USER_ROLE.HOST }).populate("profile");

    logger.info(`Fetched ${users.length} users successfully.`);

    const potentialHosts = users;

    if (!potentialHosts.length) {
      throw new Error(
        "No host or admin users found in the database. Seeding aborted."
      );
    }

    logger.info(`Found ${potentialHosts.length} potential hosts.`);

    logger.info(`Seeding ${eventsData.length} events...`);

    const createdEvents = [];

    for (const eventInfo of eventsData) {
      const randomHost =
        potentialHosts[Math.floor(Math.random() * potentialHosts.length)];

      const event = new Event({
        ...eventInfo,
        host: randomHost._id,
        members: [],
        isPostedToFacebook: false
      });

      await event.save();
      createdEvents.push(event);
    }

    logger.info(`Successfully seeded ${createdEvents.length} events.`);
  } catch (error) {
    logger.error("Error seeding events:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB.");
  }
};

seedEvents();
