"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "@/hooks/use-custom-mutation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotifications } from "@/components/ui/notifications";
import { deleteUserApi } from "../api/users";
import { QUERY_KEYS } from "@/configs/querykey";
import { Loader2 } from "lucide-react";
import { TenantUser } from "@/features/tenants/api/tenants";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: TenantUser | null;
  tenantId: string;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  tenantId,
}: DeleteUserDialogProps) {
  const { addNotification } = useNotifications();

  const mutation = useCustomMutation({
    service: deleteUserApi,
    queryKey: [[QUERY_KEYS.TENANT_DETAILS, tenantId]],
    successTitle: "User deleted successfully",
    successMessage: "User deleted successfully",
    onSuccess: () => {
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      addNotification({
        type: "error",
        title: "Failed to delete user",
        message:
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || "An error occurred",
      });
    },
  });

  const handleDelete = () => {
    if (user) {
      mutation.mutate(user.id);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {user.firstName} {user.lastName}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
