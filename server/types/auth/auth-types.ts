import { z } from "zod";
import { TUser } from "../../models/user.model";
import {
  RefreshAccessTokenDtoSchema,
  UpdateUserInfoDtoSchema,
  UpdateUserPasswordDtoSchema
} from "../../validationSchemas/auth";

export type TUpdateUserInfoRequestBodyDto = z.infer<
  typeof UpdateUserInfoDtoSchema
>;

export type TUpdateUserPasswordRequestBodyDro = z.infer<
  typeof UpdateUserPasswordDtoSchema
>;

export type TRefreshAccessTokenRequestBodyDto = z.infer<
  typeof RefreshAccessTokenDtoSchema
>;

export type TUserResponse = TUser;
