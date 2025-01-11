import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api-error";
import logger from "../utils/winston";

const errorHandler = (
  error: ApiError | Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    logger.error(error.message);
    res.status(error.status).json(
      error.data ?? {
        message: error.message
      }
    );
    return;
  }

  res.status(500).json({ message: error.message || "Server error" });
  logger.error(error);
  next(error);
};

export default errorHandler;
