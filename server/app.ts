import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import next from "next";
import errorHandler from "./middlewares/error-handler";
import configMorgan from "./middlewares/morgan";
import router from "./routers";
import { NEXT_LOCAL_SERVER_URL, NODE_ENV } from "./settings/config";
import logger from "./utils/winston";

const app = express();
const nextApp = next({ dev: NODE_ENV === "development" });
const handle = nextApp.getRequestHandler();

app.use(
  cors({
    credentials: true,
    origin: [NEXT_LOCAL_SERVER_URL]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", NEXT_LOCAL_SERVER_URL);
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

app.use("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

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
