import {
  TAIPromptResponse,
  TGenerateEventPlanResponse,
  TPromptRequestDto
} from "../../common/types/ai.types";
import BaseRepository from "./base.repository";

class AIRepository extends BaseRepository {
  static readonly apiRouter = "/ai";

  static executePrompt(body: TPromptRequestDto) {
    return this.request<TPromptRequestDto, { result: TAIPromptResponse }>(
      this.apiRouter,
      "post",
      body
    );
  }

  static generateEventPlan(body: TPromptRequestDto) {
    return this.request<
      TPromptRequestDto,
      { result: TGenerateEventPlanResponse }
    >(`${this.apiRouter}/generate-event`, "post", body);
  }
}

export default AIRepository;
