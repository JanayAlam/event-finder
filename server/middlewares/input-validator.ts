import { NextFunction, Request, Response } from "express";
import z from "zod";
import logger from "../utils/winston";

const inputValidator = (
  bodySchema: z.ZodSchema<any> | null,
  paramsSchema?: z.ZodSchema<any> | null,
  querySchema?: z.ZodSchema<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.headers["content-type"]?.split("/")[0] === "multipart") {
        Object.keys(req.body).forEach((key) => {
          try {
            req.body[key] = JSON.parse(req.body[key]);
          } catch (err) {}
        });
      }

      if (bodySchema) {
        req.body = await bodySchema.parse(req.body);
      }

      if (paramsSchema) {
        req.params = await paramsSchema.parse(req.params);
      }

      if (querySchema) {
        req.query = await querySchema.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        let errObj: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const keys = issue.path.length ? issue.path : undefined;
          if (keys?.length) {
            keys.forEach((key) => {
              errObj = {
                ...errObj,
                [key]: issue.message
              };
            });
          }
        });

        res.status(400).json(errObj);
      } else {
        logger.error(error);
        res.status(500).json({ message: "Server error" });
      }
    }
  };
};

export default inputValidator;
