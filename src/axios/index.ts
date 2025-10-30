import { SERVER_API_URL } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${SERVER_API_URL || "http://localhost:5000/api/v1"}`,
  withCredentials: true
});
