import { apiClient } from "@/lib/apiClient";

export const registerUser = (body: { name: string; email: string; password: string }) =>
  apiClient.post("/user/register", body).then((r) => r.data);

export const loginUser = (body: { email: string; password: string }) =>
  apiClient.post("/user/login", body).then((r) => r.data);