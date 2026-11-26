"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { RoleSchema, RoleFormData } from "../schemas/roleSchemas";
import { useCreateRole, useUpdateRole } from "../api/roles";
import { Role } from "../types";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleToEdit?: Role | null;
}

export function RoleDialog({
  open,
  onOpenChange,
  roleToEdit,
}: RoleDialogProps) {
  const isEditing = !!roleToEdit;

  const form = useForm<RoleFormData>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (roleToEdit) {
        form.reset({
          name: roleToEdit.name || "",
          description: roleToEdit.description || "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
        });
      }
    }
  }, [open, roleToEdit, form]);

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: RoleFormData) => {
    if (isEditing && roleToEdit) {
      updateMutation.mutate(
        {
          id: roleToEdit.id,
          data: {
            name: data.name,
            description: data.description || undefined,
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          name: data.name,
          description: data.description || undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? "Edit Role" : "Create New Role"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? `Modify role metadata for "${roleToEdit?.name}".`
                  : "Define a new custom role to control staff and member access."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Librarian, Academic Head" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe what responsibilities this role manages..."
                      className="resize-none min-h-[90px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
