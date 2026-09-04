import React, { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCustomMutation } from "@/hooks/use-custom-mutation";
import { createTenantApi } from "../api/tenants";

const tenantSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  adminEmail: z.string().email({ message: "Must be a valid email address." }),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface AddTenantDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddTenantDialog({ children, onSuccess }: AddTenantDialogProps) {
  const [open, setOpen] = React.useState(false);
  const formRef = useRef<UseFormReturn<TenantFormValues>>(null);

  const { mutate: createTenant, isPending } = useCustomMutation({
    service: createTenantApi,
    form: formRef as any,
    queryKey: [["tenants"]], // This will invalidate the tenants query automatically on success
    successMessage: "Tenant created successfully",
    onSuccess: () => {
      setOpen(false);
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit = (data: TenantFormValues) => {
    createTenant(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add Tenant</DialogTitle>
          <DialogDescription>
            Create a new institution tenant and define its initial
            administrator.
          </DialogDescription>
        </DialogHeader>

        <Form
          ref={formRef}
          schema={tenantSchema}
          onSubmit={onSubmit}
          options={{ defaultValues: { name: "", adminEmail: "" } }}
        >
          {(formProps) => (
            <div className="space-y-4">
              <FormField
                control={formProps.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Greenwood High School"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formProps.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@greenwood.edu"
                        type="email"
                        disabled={isPending}
                        {...field}
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
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Tenant
                </Button>
              </DialogFooter>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
