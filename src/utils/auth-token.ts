import axios from "axios";
import { TUserWithProfileResponse } from "../../server/types/auth";

type AuthStatusResponse = {
  isLoggedIn: boolean;
  user: TUserWithProfileResponse | null;
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
