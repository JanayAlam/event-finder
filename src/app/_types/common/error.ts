import { AxiosError } from "axios";

export type CommonApiError = AxiosError<{
  message?: string;
}>;

export type BadRequestApiError = AxiosError<Record<string, string>>;
