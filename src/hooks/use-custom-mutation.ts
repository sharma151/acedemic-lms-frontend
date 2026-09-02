import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useNotifications } from "@/components/ui/notifications";
import { MutationResponse, SuccessResponseInterface } from "@/types/api";
import { syncFormErrors } from "@/utils/sync-form-errors";

function resolveMutationPayload<T>(data: unknown): T {
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    (data as { data: unknown }).data !== undefined
  ) {
    return (data as { data: T }).data;
  }
  return data as T;
}

type CustomMutationProps<T, X = unknown> = {
  queryKey?: string[] | string[][];
  service: (
    data: T,
  ) => Promise<X | SuccessResponseInterface<X> | MutationResponse<X>>;
  form?: UseFormReturn;
  navigateTo?: string;
  onSuccess?: (data: X) => void;
  onError?: (err: AxiosError) => void;
  successMessage?: string;
  successTitle?: string;
  showSuccessNotification?: boolean;
};

export const useCustomMutation = <T, X>({
  queryKey,
  service,
  form,
  navigateTo,
  onSuccess,
  onError,
  successMessage,
  successTitle = "Success",
  showSuccessNotification = true,
}: CustomMutationProps<T, X>) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const router = useRouter();

  return useMutation({
    mutationFn: service,
    onSuccess: (data) => {
      if (queryKey) {
        queryKey.forEach((key) => {
          queryClient.invalidateQueries({
            queryKey: Array.isArray(key) ? key : [key],
          });
        });
      }

      if (showSuccessNotification) {
        const responseMessage =
          data && typeof data === "object" && "message" in data
            ? ((data as { message?: string }).message ?? undefined)
            : undefined;
        addNotification({
          type: "success",
          title: successTitle,
          message:
            successMessage ??
            responseMessage ??
            "Action completed successfully!",
        });
      }

      if (form) form.reset();
      if (navigateTo) router.push(navigateTo);
      if (onSuccess) onSuccess(resolveMutationPayload<X>(data));
    },
    onError: (err: AxiosError) => {
      if (form) syncFormErrors(form, err);
      if (onError) onError(err);

      // Always show an error toast for non-422 errors (like 401 Unauthorized, 500 Server Error, Network Error)
      if (err.response?.status !== 422) {
        const errMessage = (err.response?.data as any)?.message || err.message;
        addNotification({
          type: "error",
          title: "Error",
          message: errMessage || "Something went wrong",
        });
      } else if (!form) {
        // If it's a 422 but we don't have a form to show field errors on, show a toast
        const errMessage =
          (err.response?.data as any)?.message || "Validation failed";
        addNotification({
          type: "error",
          title: "Validation Error",
          message: errMessage,
        });
      }
    },
  });
};
