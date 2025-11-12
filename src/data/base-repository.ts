import { API_BASE_URL } from "@/config";
import { getAccessToken } from "@/utils/auth-token";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type THttpMethod = "post" | "get" | "put" | "patch" | "delete";

abstract class BaseRepository {
  readonly http = axios.create({
    baseURL: `${API_BASE_URL || "http://localhost:5000/api/v1"}`,
    withCredentials: true
  });

  constructor() {
    this.http.interceptors.request.use(
      async (config) => {
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public abstract getApiRoute(): string;

  public request<InputBody, ResponseType>(
    method: THttpMethod,
    id: string | undefined,
    body: InputBody | undefined,
    config: AxiosRequestConfig | undefined
  ): Promise<AxiosResponse<ResponseType>> {
    const finalUrl =
      this.getApiRoute() + ["post", "get"].includes(method) && !id
        ? ""
        : `/${id}`;
    const firstParam = ["post", "put", "patch"].includes(method)
      ? body
      : config;
    const secondParam = ["post", "put", "patch"].includes(method)
      ? config
      : undefined;

    try {
      const res = this.http[method]<ResponseType>(
        finalUrl,
        firstParam,
        secondParam
      );
      return res;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw err;
      }
      throw err;
    }
  }
}

export default BaseRepository;
