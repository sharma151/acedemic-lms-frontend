import { apiClient } from '@/lib/api-client';

export const logoutApi = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};
