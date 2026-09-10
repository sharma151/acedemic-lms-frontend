"use client";

import  {  useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  registerTenantUserSchema,
  RegisterTenantUserFormData,
} from "../schemas/tenantUserSchema";
import { registerTenantUserApi } from "../api/tenants";
import { useCustomMutation } from "@/hooks/use-custom-mutation";

interface RegisterUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string | null;
}

export const RegisterUserModal = ({
  open,
  onOpenChange,
  tenantSlug,
}: RegisterUserModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useCustomMutation<RegisterTenantUserFormData, any>({
    queryKey: [], // Doesn't need to invalidate anything particular unless we fetch all users
    service: registerTenantUserApi,
    successMessage: "User registered successfully",
  });

  const onSubmit = (data: RegisterTenantUserFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const defaultValues = {
    tenantSlug: tenantSlug || "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  // Prevent rendering form contents if we don't have a slug
  if (!tenantSlug && open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Register User</DialogTitle>
          <DialogDescription>
            Register a new user under the selected tenant.
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={registerTenantUserSchema}
          onSubmit={onSubmit}
          options={{
            defaultValues: defaultValues,
            values: defaultValues,
          }}
        >
          {(form) => (
            <div className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="tenantSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="bg-slate-50 text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register User
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
