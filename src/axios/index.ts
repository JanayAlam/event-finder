import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LOCAL_SERVER_URL || "http://localhost:5000"}/api/v1`,
  withCredentials: true
});
