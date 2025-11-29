import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import next from "next";
import router from "./api/v1/routers";
import "./events/register-event-listeners";
import errorHandler from "./middlewares/error-handler.middleware";
import configMorgan from "./middlewares/morgan.middleware";
import { NODE_ENV, PUBLIC_SERVER_URL } from "./settings/config";
import logger from "./utils/winston.util";

const app = express();
const nextApp = next({ dev: NODE_ENV === "development" });
const handle = nextApp.getRequestHandler();

app.use(
  cors({
    credentials: true,
    origin: [PUBLIC_SERVER_URL]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", PUBLIC_SERVER_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

configMorgan(app);

app.use("/api/v1", router);

app.use(errorHandler);

(async () => {
  try {
    await nextApp.prepare();

    app.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    logger.info("Next.js app prepared successfully");
  } catch (err) {
    logger.error((err as Error).message);
    process.exit(1);
  }
})();

export default app;
