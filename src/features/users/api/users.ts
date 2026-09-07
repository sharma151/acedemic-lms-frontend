import { apiClient } from "@/lib/api-client";
import { AddUserFormData } from "../schemas/userSchemas";

export const addUserApi = async (data: AddUserFormData): Promise<unknown> => {
  const response = await apiClient.post("/users", data);
  return response.data;
};
