"use client";

import React from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteRole } from "../api/roles";
import { Role } from "../types";

interface DeleteRoleDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRoleDialog({
  role,
  open,
  onOpenChange,
}: DeleteRoleDialogProps) {
  const deleteMutation = useDeleteRole();

  if (!role) return null;

  const handleConfirm = () => {
    deleteMutation.mutate(role.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <ConfirmDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title={`Delete Role "${role.name}"?`}
      description={
        <span>
          Are you sure you want to delete this role? Any users assigned to this role
          will lose associated permissions. This action cannot be undone.
        </span>
      }
      confirmText="Delete Role"
      cancelText="Cancel"
      variant="destructive"
      isLoading={deleteMutation.isPending}
    />
  );
}
