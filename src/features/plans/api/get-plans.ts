import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { PlansResponse, SubscriptionPlan } from "../types";

export const getPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await apiClient.get<PlansResponse>("/tenants/plans");
  return response.data.data;
};

export const useGetPlans = () => {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: getPlans,
  });
};
