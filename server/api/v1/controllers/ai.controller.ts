import { NextFunction, Request, Response } from "express";
import {
  TAIEventCreationSchemaDto,
  TPromtRequestDto
} from "../../../../common/types/ai.types";
import runEventSearchAgent, { runEventCreatorAgent } from "../../../ai/run";

type TExecutePromtRequest = Request<unknown, unknown, TPromtRequestDto>;
type TGenerateEventPlanRequest = Request<
  unknown,
  unknown,
  TAIEventCreationSchemaDto
>;

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

  static async generateEventPlan(
    req: TGenerateEventPlanRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { prompt } = req.body;
      const result = await runEventCreatorAgent(prompt);
      res.json({ result: result.finalOutput });
    } catch (err) {
      next(err);
    }
  }
}

export default AIController;
