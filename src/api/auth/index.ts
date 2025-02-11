import { axiosInstance } from "@/axios";
import { TUserResponse } from "../../../server/types/auth";

export const getAuthUserApi = () => {
  return axiosInstance.get<TUserResponse>("/auth/user");
};

export const logoutApi = () => {
  localStorage.removeItem("user");
  return axiosInstance.delete<{}>("/auth/logout");
};
