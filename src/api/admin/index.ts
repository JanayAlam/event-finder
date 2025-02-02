import { axiosInstance } from "@/axios";
import {
  TAdminLoginRequest,
  TAdminLoginResponse
} from "../../../server/types/admin";

export const adminLoginApi = (data: TAdminLoginRequest) => {
  return axiosInstance.post<TAdminLoginResponse>("/admins/login", data);
};
