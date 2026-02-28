import {
  TAIPromtResponse,
  TPromtRequestDto
} from "../../common/types/ai.types";
import BaseRepository from "./base.repository";

class AIRepository extends BaseRepository {
  static readonly apiRouter = "/ai";

  static executePrompt(body: TPromtRequestDto) {
    return this.request<TPromtRequestDto, { result: TAIPromtResponse }>(
      this.apiRouter,
      "post",
      body
    );
  }
}

export default AIRepository;
