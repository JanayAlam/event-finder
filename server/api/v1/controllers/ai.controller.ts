import { NextFunction, Request, Response } from "express";
import {
  TAIEventCreationSchemaDto,
  TPromptRequestDto
} from "../../../../common/types/ai.types";
import runEventSearchAgent, { runEventCreatorAgent } from "../../../ai/run";

type TExecutePromptRequest = Request<unknown, unknown, TPromptRequestDto>;
type TGenerateEventPlanRequest = Request<
  unknown,
  unknown,
  TAIEventCreationSchemaDto
>;

class AIController {
  static async executePrompt(
    req: TExecutePromptRequest,
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
      const { prompt, conversationHistory } = req.body;
      const result = await runEventCreatorAgent(
        prompt,
        conversationHistory || []
      );
      res.json({ result: result.finalOutput });
    } catch (err) {
      next(err);
    }
  }
}

export default AIController;
