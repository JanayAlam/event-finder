import { axiosInstance } from "@/axios";

export const logoutApi = () => {
  return axiosInstance.delete<{}>("/auth/logout");
};
