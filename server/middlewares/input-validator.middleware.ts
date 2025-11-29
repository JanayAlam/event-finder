import { NextFunction, Request, Response } from "express";
import z from "zod";
import logger from "../utils/winston.util";

const inputValidator = (
  bodySchema: z.ZodSchema<any> | null,
  paramsSchema?: z.ZodSchema<any> | null,
  querySchema?: z.ZodSchema<any>
) => {
  return async (
    req: Request<any, any, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.headers["content-type"]?.split("/")[0] === "multipart") {
        Object.keys(req.body).forEach((key) => {
          try {
            req.body[key] = JSON.parse(req.body[key]);
          } catch {}
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
        res.status(400).json({
          message: error.issues.length
            ? error.issues[0].message
            : "Validation error"
        });
      } else {
        logger.error(error);
        res.status(500).json({ message: "Server error" });
      }
    }
  };
};

export default inputValidator;
