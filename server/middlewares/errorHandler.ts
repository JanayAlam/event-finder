import { NextFunction, Request, Response } from "express";
import logger from "../utils/winston";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ message: "Server error" });
  logger.error(error.message);
  next(error);
};

export default errorHandler;
