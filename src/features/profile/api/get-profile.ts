import { useQuery } from "@tanstack/react-query";
import { getAuthMe } from "@/features/auth/api/auth";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["auth-profile"],
    queryFn: getAuthMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
