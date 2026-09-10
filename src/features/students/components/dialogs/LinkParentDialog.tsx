"use client";

import React from "react";
import { Loader2 } from "lucide-react";

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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { linkParentSchema, LinkParentFormData } from "../../schemas/students";
import { useLinkParent } from "../../api/students";

interface LinkParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
}

export const LinkParentDialog = ({
  open,
  onOpenChange,
  studentId,
}: LinkParentDialogProps) => {
  const linkMutation = useLinkParent(studentId);

  const defaultValues = {
    parentUserId: "",
    relationship: "FATHER" as "FATHER" | "MOTHER" | "GUARDIAN" | "OTHER",
    isEmergencyContact: false,
    canPickup: false,
  };

  const onSubmit = (data: LinkParentFormData) => {
    linkMutation.mutate(
      { id: studentId, data },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Parent / Guardian</DialogTitle>
          <DialogDescription>
            Associate a parent user account with this student.
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={linkParentSchema}
          onSubmit={onSubmit}
          options={{ defaultValues, values: defaultValues }}
        >
          {(form) => (
            <div className="space-y-4 pt-2">
              
              <FormField
                control={form.control}
                name="parentUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter parent user ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide the unique identifier for the parent's user account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="FATHER">Father</SelectItem>
                        <SelectItem value="MOTHER">Mother</SelectItem>
                        <SelectItem value="GUARDIAN">Guardian</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-4 border-t mt-4">
                <FormField
                  control={form.control}
                  name="isEmergencyContact"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Emergency Contact
                        </FormLabel>
                        <FormDescription>
                          Mark this parent as a primary emergency contact.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canPickup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Authorized for Pickup
                        </FormLabel>
                        <FormDescription>
                          This parent is authorized to pick up the student.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 space-x-2 border-t mt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={linkMutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={linkMutation.isPending}>
                  {linkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Link Parent
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
