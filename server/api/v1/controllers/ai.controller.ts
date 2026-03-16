import { NextFunction, Request, Response } from "express";
import {
  TAIEventCreationSchemaDto,
  TPromptRequestDto
} from "../../../../common/types/ai.types";
import { runEventCreatorAgent, runWorkplaceAgent } from "../../../ai/run";

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

      const result = await runWorkplaceAgent(prompt);
      res.json({ result: result.finalOutput });
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "InputGuardrailTripwireTriggered" ||
          err.message.includes("Input guardrail triggered"))
      ) {
        res.status(200).json({
          result: {
            message:
              "I can help you discover trips. Tell me where you want to go, your dates, group size, or budget. You can also generate trips based on your requirements through the AI agent if you are eligible to do so."
          }
        });
        return;
      }

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
      if (
        err instanceof Error &&
        (err.name === "InputGuardrailTripwireTriggered" ||
          err.message.includes("Input guardrail triggered"))
      ) {
        res.status(200).json({
          result: {
            message:
              "I can help you to create events. Tell me where you want to go, your dates, group size, or budget."
          }
        });
        return;
      }

      next(err);
    }
  }
}

export default AIController;
