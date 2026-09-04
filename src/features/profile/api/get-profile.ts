import { useQuery } from "@tanstack/react-query";
import { getAuthMe } from "@/features/auth/api/auth";
import { QUERY_KEYS } from "@/configs/querykey";

export const useGetProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH_PROFILE],
    queryFn: getAuthMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
