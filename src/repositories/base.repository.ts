import { useAuthStore } from "@/app/_store/auth-store";
import { API_BASE_URL } from "@/config";
import { getAuthStatus } from "@/utils/auth-token";
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

type HttpMethod = "post" | "get" | "put" | "patch" | "delete";

class BaseRepository {
  static readonly http = axios.create({
    baseURL: `${API_BASE_URL}`,
    withCredentials: true
  });

  private static isRefreshing = false;
  private static failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {}

  private static processQueue(error: any, token: string | null = null) {
    BaseRepository.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    BaseRepository.failedQueue = [];
  }

  private static initializeInterceptor() {
    BaseRepository.http.interceptors.request.use(
      async (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    BaseRepository.http.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== "/auth/refresh"
        ) {
          if (BaseRepository.isRefreshing) {
            return new Promise((resolve, reject) => {
              BaseRepository.failedQueue.push({ resolve, reject });
            })
              .then(async () => {
                const { accessToken } = await getAuthStatus();
                if (accessToken) {
                  originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return BaseRepository.http(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          BaseRepository.isRefreshing = true;

          const { refreshToken } = useAuthStore.getState();

          if (!refreshToken) {
            BaseRepository.isRefreshing = false;
            BaseRepository.processQueue(new Error("Not logged in"), null);
            toast.error("Authentication required");
            return Promise.reject(new Error("Not logged in"));
          }

          try {
            const { data } = await BaseRepository.http.post("/auth/refresh", {
              refreshToken
            });

            if (data.user && data.accessToken && data.refreshToken) {
              useAuthStore
                .getState()
                .initAuth(data.user, data.accessToken, data.refreshToken);
            }

            BaseRepository.processQueue(null, data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

            return BaseRepository.http(originalRequest);
          } catch (err) {
            BaseRepository.processQueue(err, null);
            await BaseRepository.http.get("/auth/logout");
            useAuthStore.getState().clearAuth();
            toast.error("Session expired. Please login again.");
            return Promise.reject(err);
          } finally {
            BaseRepository.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  static {
    BaseRepository.initializeInterceptor();
  }

  static async request<InputBody, ResponseType>(
    url: string,
    method: HttpMethod,
    id?: string,
    body?: InputBody,
    config?: AxiosRequestConfig
  ): Promise<ResponseType> {
    const finalUrl = `${url}${["post", "get"].includes(method) && !id ? "" : `/${id}`}`;
    const firstParam = ["post", "put", "patch"].includes(method)
      ? body
      : config;
    const secondParam = ["post", "put", "patch"].includes(method)
      ? config
      : undefined;

    const { data } = await this.http[method]<ResponseType>(
      finalUrl,
      firstParam,
      secondParam
    );

    return data;
  }
}

export default BaseRepository;
