"use client";

import { useCustomMutation } from "@/hooks/use-custom-mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/components/ui/notifications";
import { UpdateUserSchema, UpdateUserFormData } from "../schemas/userSchemas";
import { updateUserApi } from "../api/users";
import { QUERY_KEYS } from "@/configs/querykey";
import { Role } from "@/configs/constants";
import { Loader2 } from "lucide-react";
import { TenantUser } from "@/features/tenants/api/tenants";

interface UpdateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: TenantUser | null;
  tenantId: string;
}

export function UpdateUserDialog({
  open,
  onOpenChange,
  user,
  tenantId,
}: UpdateUserDialogProps) {
  const { addNotification } = useNotifications();

  const mutation = useCustomMutation({
    service: updateUserApi,
    queryKey: [[QUERY_KEYS.TENANT_DETAILS, tenantId]],
    successTitle: "User updated successfully",
    successMessage: "User updated successfully",
    onSuccess: () => {
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      addNotification({
        type: "error",
        title: "Failed to update user",
        message:
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || "An error occurred",
      });
    },
  });

  const onSubmit = (data: UpdateUserFormData) => {
    if (user) {
      // Create FormData if dealing with files, or simply pass the data
      // For now, passing data directly to maintain the API structure.
      mutation.mutate({ id: user.id, data });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Update details for {user.firstName} {user.lastName}.
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={UpdateUserSchema}
          options={{
            values: {
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              roleName: user.role || "",
              avatarUrl: user.avatarUrl || "",
            },
          }}
          onSubmit={onSubmit}
          className="space-y-4 pt-4"
        >
          {(form) => (
            <>
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
                name="roleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Role.INSTITUTION_ADMIN}>
                          {Role.INSTITUTION_ADMIN}
                        </SelectItem>
                        <SelectItem value={Role.TEACHER}>
                          {Role.TEACHER}
                        </SelectItem>
                        <SelectItem value={Role.STUDENT}>
                          {Role.STUDENT}
                        </SelectItem>
                        <SelectItem value={Role.PARENT}>
                          {Role.PARENT}
                        </SelectItem>
                        <SelectItem value={Role.ACCOUNTANT}>
                          {Role.ACCOUNTANT}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".png, .jpeg, .jpg, .webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Updating...
                    </>
                  ) : (
                    "Update User"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
