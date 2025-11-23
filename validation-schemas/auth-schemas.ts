import { z } from "zod";

export const RefreshAccessTokenDtoSchema = z.object({
  refreshToken: z.string().trim()
});
