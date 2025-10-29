import { Request, Response } from "express";

export const blockUserHandler = async (
  req: Request<any, any, any, any>,
  res: Response
) => {
  const { userId } = req.body;

  try {
    //
    res.status(204).send();
  } catch (err) {
    res.status(404).json({
      message: "User not found or cannot be blocked"
    });
  }
};

export const unblockUserHandler = async (
  req: Request<any, any, any, any>,
  res: Response
) => {
  const { userId } = req.body;

  try {
    //
    res.status(204).send();
  } catch (err) {
    res.status(404).json({
      message: "User not found or cannot be unblocked"
    });
  }
};
