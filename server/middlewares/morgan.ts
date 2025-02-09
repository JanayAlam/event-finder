import { Express, Request, Response } from "express";
import morgan from "morgan";
import logger from "../utils/winston";

const configMorgan = (app: Express) => {
  morgan.token("body", (req: Request) => req.body);
  morgan.token("res-body", (req: Request, res: Response) => res.locals.body);

  app.use(
    morgan((tokens, req, res) => {
      if (!req.baseUrl || !req.baseUrl.startsWith("/api")) {
        return undefined;
      }

      try {
        const method = tokens.method(req, res);
        const url = tokens.url(req, res);

        const responseStatus = tokens.status(req, res);
        const responseTime = tokens["response-time"](req, res);

        logger.http(`${method} ${url} - ${responseStatus} - ${responseTime}ms`);

        return undefined;
      } catch (err) {
        logger.error((err as Error).message);
      }
    })
  );
};

export default configMorgan;
