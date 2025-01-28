import { Express, Request, Response } from "express";
import morgan from "morgan";
import logger from "../utils/winston";

const configMorgan = (app: Express) => {
  morgan.token("body", (req: Request) => req.body);
  morgan.token("res-body", (req: Request, res: Response) => res.locals.body);

  app.use(
    morgan((tokens, req, res) => {
      if (!req.baseUrl || !req.baseUrl.startsWith("/api")) {
        // Don't want next app page calls to be logged
        return undefined;
      }

      try {
        // Request
        const method = tokens.method(req, res);
        const url = tokens.url(req, res);
        // Response
        const responseStatus = tokens.status(req, res);
        const responseTime = tokens["response-time"](req, res);
        const responseBody = tokens["res-body"](req, res);

        if (method !== "OPTIONS" && responseStatus && responseTime) {
          logger.http(
            `${method} ${url} - ${responseStatus} - ${responseTime}ms`
          );

          if (
            responseStatus !== "200" &&
            responseStatus !== "304" &&
            !req.file
          ) {
            logger.http(responseBody);
          }
        }
        // No logs for morgan
        return undefined;
      } catch (err) {
        logger.error((err as Error).message);
      }
    })
  );
};

export default configMorgan;
