import { API_BASE_URL } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL || "http://localhost:5000/api/v1"}`,
  withCredentials: true
});
