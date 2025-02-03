import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../settings/config";
import ApiError from "../utils/api-error";
import logger from "../utils/winston";

const errorHandler = (
  error: ApiError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    ...(error instanceof ApiError
      ? { data: error.data, status: error.status }
      : {})
  };

  logger.error(errorDetails);

  if (error instanceof ApiError) {
    res.status(error.status).json(
      error.data ?? {
        message: error.message
      }
    );
    return;
  }

  res
    .status(500)
    .json({
      message:
        NODE_ENV !== "production"
          ? error.message || "Server error"
          : "Server error"
    });
};

export default errorHandler;
