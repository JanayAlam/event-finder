import { Request, Response } from "express";

export const getHealthController = (_req: Request, res: Response) => {
  res.status(200).send("Ok");
};
