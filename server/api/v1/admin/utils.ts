import { PUBLIC_SERVER_URL } from "../../../settings/config";

export const getResetPasswordLink = (token: string) =>
  `${PUBLIC_SERVER_URL}/reset-password/t/${token}`;
