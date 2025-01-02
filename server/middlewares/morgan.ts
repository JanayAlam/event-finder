import { Express, Request } from "express";
import morgan from "morgan";
import logger from "../utils/winston";

const configMorgan = (app: Express) => {
  morgan.token("body", (req: Request) => req.body);
  // morgan.token("res-body", (_req, res: any) => res.responseBody);

  app.use(
    morgan(function (tokens, req, res) {
      if (!req.baseUrl || !req.baseUrl.startsWith("/api")) {
        // Don't want next app page calls to be logged
        return undefined;
      }

      try {
        // request
        const method = tokens.method(req, res);
        const url = tokens.url(req, res);
        // response
        const responseStatus = tokens.status(req, res);
        const responseTime = tokens["response-time"](req, res);
        const responseBody = tokens["res-body"](req, res);

        if (method !== "OPTIONS" && responseStatus && responseTime) {
          // log
          logger.http(`${method} ${url} ${responseStatus} - ${responseTime}ms`);
          if (method === "GET" && !req.file) {
            // log query
            logger.http(req.query);
          } else if (!req.file) {
            // log body
            logger.http(tokens.body(req, res));
          }
          // log response if not 200 / 304
          if (
            responseStatus !== "200" &&
            responseStatus !== "304" &&
            !req.file
          ) {
            logger.http(responseBody);
          }
        }
        // no logs for morgan
        return undefined;
      } catch {}
    })
  );
};

export default configMorgan;
