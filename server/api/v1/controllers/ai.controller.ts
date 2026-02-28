import { NextFunction, Request, Response } from "express";
import { TPromtRequestDto } from "../../../../common/types/ai.types";
import runEventSearchAgent from "../../../ai/run";

type TExecutePromtRequest = Request<unknown, unknown, TPromtRequestDto>;

class AIController {
  static async executePromt(
    req: TExecutePromtRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { prompt } = req.body;

      const result = await runEventSearchAgent(prompt);
      res.json({ result: result.finalOutput });
    } catch (err) {
      next(err);
    }
  }
}

export default AIController;
