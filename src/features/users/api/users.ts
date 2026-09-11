import { apiClient } from "@/lib/api-client";
import { AddUserFormData, UpdateUserFormData } from "../schemas/userSchemas";

export const addUserApi = async (data: AddUserFormData): Promise<unknown> => {
  const response = await apiClient.post("/users", data);
  return response.data;
};

export const updateUserApi = async ({ id, data }: { id: string; data: UpdateUserFormData }): Promise<unknown> => {
  let payload: any = data;
  let headers = {};
  
  if (data.avatarUrl instanceof File) {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("roleName", data.roleName);
    formData.append("avatarUrl", data.avatarUrl);
    payload = formData;
    headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await apiClient.put(`/users/${id}`, payload, { headers });
  return response.data;
};

export const deleteUserApi = async (id: string): Promise<unknown> => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
