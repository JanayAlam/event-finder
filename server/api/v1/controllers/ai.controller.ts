import { NextFunction, Request, Response } from "express";
import {
  IWorkspaceAgentUserContext,
  TAIEventCreationSchemaDto,
  TPromptRequestDto
} from "../../../../common/types/ai.types";
import { runEventCreatorAgent, runWorkspaceAgent } from "../../../ai/run";
import UserUseCase from "../../../libs/use-cases/user.use-case";
import { TUser } from "../../../models/user.model";

type TExecutePromptRequest = Request<unknown, unknown, TPromptRequestDto>;
type TGenerateEventPlanRequest = Request<
  unknown,
  unknown,
  TAIEventCreationSchemaDto
>;

class AIController {
  private static isInputGuardrailError(err: any) {
    return (
      err instanceof Error &&
      (err.name === "InputGuardrailTripwireTriggered" ||
        err.message.includes("Input guardrail triggered"))
    );
  }

  private static async getUserContext(
    user?: TUser | null
  ): Promise<IWorkspaceAgentUserContext | undefined> {
    let userContext: IWorkspaceAgentUserContext | undefined = undefined;

    if (user) {
      const userWithProfile = await UserUseCase.getByIdWithProfile(user._id);

      if (userWithProfile) {
        const { email, role, profile } = userWithProfile;
        userContext = {
          name: profile
            ? [profile.firstName, profile.lastName].join(" ")
            : email.split("@")[0],
          role: role
        };
      }
    }

    return userContext;
  }

  static async executePrompt(
    req: TExecutePromptRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { prompt } = req.body;

      const userContext = await AIController.getUserContext(req.user);

      const result = await runWorkspaceAgent(prompt, userContext);

      res.json({ result: result.finalOutput });
    } catch (err) {
      if (AIController.isInputGuardrailError(err)) {
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

      const userContext = await AIController.getUserContext(req.user);

      const result = await runEventCreatorAgent(prompt, {
        conversationHistory: conversationHistory || [],
        userInfo: userContext
      });

      res.json({ result: result.finalOutput });
    } catch (err) {
      if (AIController.isInputGuardrailError(err)) {
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
