import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useNotifications } from "@/components/ui/notifications";
import { MutationResponse, SuccessResponseInterface } from "@/types/api";
import { syncFormErrors } from "@/utils/sync-form-errors";

/**
 * Backend returns ApiResponse<T> (status, statusCode, message, data).
 * Unwrap so onSuccess receives the entity from data.
 */
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

type props<T, X = unknown> = {
  queryKey?: string[] | string[][]; // Made optional to support LoginForm which has no queryKey to invalidate
  service: (
    data: T,
  ) => Promise<X | SuccessResponseInterface<X> | MutationResponse<X>>;
  form?: UseFormReturn | React.RefObject<UseFormReturn | null>;
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
}: props<T, X>) => {
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
            successMessage ?? responseMessage ?? "Data created successfully!",
        });
      }

      const actualForm = form && "current" in form ? form.current : form;
      if (actualForm) actualForm.reset();

      if (navigateTo) router.replace(navigateTo);

      if (onSuccess) onSuccess(resolveMutationPayload<X>(data));
    },
    onError: (err: AxiosError) => {
      const actualForm = form && "current" in form ? form.current : form;
      if (actualForm) syncFormErrors(actualForm, err);
      if (onError) onError(err);
    },
  });
};
