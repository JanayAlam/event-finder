import { NextFunction, Request, Response } from "express";
import {
  TAiEventCreationSchemaDto,
  TPromtRequestDto
} from "../../../../common/types/ai.types";
import runEventSearchAgent, { runEventCreatorAgent } from "../../../ai/run";

type TExecutePromtRequest = Request<unknown, unknown, TPromtRequestDto>;
type TGenerateEventPlanRequest = Request<
  unknown,
  unknown,
  TAiEventCreationSchemaDto
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
      const { place, when, back } = req.body;
      const prompt = `Generate an event plan for a trip to ${place} from ${when} to ${back}.`;

      const result = await runEventCreatorAgent(prompt);
      res.json({ result: result.finalOutput });
    } catch (err) {
      next(err);
    }
  }
}

export default AIController;
