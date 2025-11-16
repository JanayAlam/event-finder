import axios from "axios";
import { TUserResponse } from "../../server/types/auth";

type AuthStatusResponse = {
  isLoggedIn: boolean;
  user: TUserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
};

export const getAuthStatus = async (): Promise<AuthStatusResponse> => {
  try {
    const { data } = await axios.get("/api/auth", {
      withCredentials: true
    });
    return data;
  } catch {
    return {
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null
    };
  }
};
