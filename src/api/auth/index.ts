import { axiosInstance } from "@/axios";
import { TUserResponse } from "../../../server/types/auth";

export const getAuthUserApi = () => {
  return axiosInstance.get<TUserResponse>("/auth/user");
};

export const logoutApi = () => {
  return axiosInstance.delete<{}>("/auth/logout");
};
