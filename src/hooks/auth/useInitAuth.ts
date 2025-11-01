import { useAuthStore } from "@/app/_store/auth-store";
import axios from "axios";
import { useEffect } from "react";

export const useInitAuth = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const { data } = await axios.get("/api/auth/me");
        initAuth(data.user, data.accessToken, data.refreshToken);
      } catch {
        initAuth(null, null, null);
      }
    };
    fetchAuth();
  }, [initAuth]);
};
