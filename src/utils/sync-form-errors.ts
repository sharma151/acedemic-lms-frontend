import { AxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";

/**
 * Synchronizes backend validation errors with React Hook Form.
 * Assumes backend returns a 422 with a JSON structure like:
 * { errors: { field_name: ["Error message 1"] } }
 */
export const syncFormErrors = (form: UseFormReturn<any>, err: AxiosError) => {
  if (err.response?.status === 422) {
    const data = err.response.data as any;

    if (data?.errors && typeof data.errors === "object") {
      Object.keys(data.errors).forEach((key) => {
        const message = Array.isArray(data.errors[key])
          ? data.errors[key][0]
          : data.errors[key];
        form.setError(key, { type: "server", message });
      });
    }
  }
};
