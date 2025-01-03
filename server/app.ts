import cookieParser from "cookie-parser";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import next from "next";
import errorHandler from "./middlewares/errorHandler";
import configMorgan from "./middlewares/morgan";
import router from "./routers";
import { NODE_ENV } from "./settings/config";
import logger from "./utils/winston";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});

const nextApp = next({ dev: NODE_ENV === "development" });
const handle = nextApp.getRequestHandler();

(async () => {
  try {
    await nextApp.prepare();
    app.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
  } catch (err) {
    logger.error((err as Error).message);
    process.exit(1);
  }
})();

app.use(cookieParser());

configMorgan(app);

app.use("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.use("/api/v1", router);

app.use(errorHandler);

export default app;
