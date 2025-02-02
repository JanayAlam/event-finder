import { AxiosError } from "axios";

interface IErrorData<T> {
  status: number;
  error: string;
  data?: T;
}

export function handlePrivateApiError<T>(
  err: AxiosError<T>,
  logoutAction?: () => void
): IErrorData<T> {
  if (err && err.response && err.response.status) {
    switch (err.response.status) {
      case 400: {
        return { status: 400, error: "", data: err.response.data };
      }
      case 401: {
        if (logoutAction) {
          logoutAction();
        }
        return {
          status: 401,
          error: "Your session has expired",
          data: err.response.data
        };
      }
      case 403: {
        return { status: 403, error: "", data: err.response.data };
      }
      case 404: {
        return { status: 404, error: "", data: err.response.data };
      }
      case 500:
        return { status: 500, error: "Server error!", data: err.response.data };
      default:
        return { status: 520, error: "Something went wrong!" };
    }
  } else {
    return { status: 520, error: "Something went wrong!" };
  }
}

export function handlePublicApiError<T>(err: AxiosError<T>): IErrorData<T> {
  if (err && err.response && err.response.status) {
    switch (err.response.status) {
      case 400: {
        return { status: 400, error: "", data: err.response.data };
      }
      case 401: {
        return { status: 401, error: "", data: err.response.data };
      }
      case 403: {
        return { status: 403, error: "", data: err.response.data };
      }
      case 404: {
        return { status: 404, error: "", data: err.response.data };
      }
      case 500:
        return { status: 500, error: "Server error!", data: err.response.data };
      default:
        return {
          status: err?.response?.status || 520,
          error: "Something went wrong!"
        };
    }
  } else {
    return { status: 520, error: "Something went wrong!" };
  }
}
