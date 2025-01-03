import { Request, Response } from "express";

export const getAuthUser = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};
