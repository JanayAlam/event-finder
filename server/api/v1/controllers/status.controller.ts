import { Request, Response } from "express";

class StatusController {
  static async health(_req: Request, res: Response) {
    res.status(200).send("Ok");
  }
}

export default StatusController;
