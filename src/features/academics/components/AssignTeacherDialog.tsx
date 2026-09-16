"use client";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Loader2, UserX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignTeacherSchema, AssignTeacherFormData } from "../schemas/academics";
import { Subject } from "../types";
import { useAssignTeacher } from "../api/subjects";

interface AssignTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject | null;
  teachers: { id: string; firstName: string; lastName: string }[];
}

export const AssignTeacherDialog = ({
  open,
  onOpenChange,
  subject,
  teachers,
}: AssignTeacherDialogProps) => {
  const mutation = useAssignTeacher();

  if (!subject) return null;

  const initialData: AssignTeacherFormData = {
    teacherId: subject.teacherId ?? null,
  };

  const onSubmit = (data: AssignTeacherFormData) => {
    mutation.mutate(
      {
        id: subject.id,
        data: { teacherId: data.teacherId || null },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
          <DialogDescription>
            Assign or reassign a teacher to{" "}
            <strong>{subject.name}</strong>. Select &quot;Unassign&quot; to
            remove the current teacher.
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={assignTeacherSchema}
          onSubmit={onSubmit}
          options={{
            defaultValues: initialData,
            values: initialData,
          }}
        >
          {(form) => (
            <div className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val === "__unassign__" ? null : val)
                      }
                      value={field.value ?? "__unassign__"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__unassign__">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <UserX className="h-4 w-4" />
                            Unassign Teacher
                          </span>
                        </SelectItem>
                        {teachers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.firstName} {t.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2 space-x-2">
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
                  Save Assignment
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
