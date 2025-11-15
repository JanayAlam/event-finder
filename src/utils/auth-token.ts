import axios from "axios";
import { TUser } from "../../server/models/user.model";

type AuthStatusResponse = {
  isLoggedIn: boolean;
  user: TUser | null;
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
