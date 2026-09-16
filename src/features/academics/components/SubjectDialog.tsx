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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { subjectSchema, SubjectFormData } from "../schemas/academics";
import { Subject } from "../types";
import { useCreateSubject, useUpdateSubject } from "../api/subjects";
import { useGetClassSections } from "../api/classes";

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
  /** Pre-select classId when opening from a class context */
  defaultClassId?: string;
  teachers?: { id: string; firstName: string; lastName: string }[];
}

export const SubjectDialog = ({
  open,
  onOpenChange,
  subject,
  defaultClassId,
  teachers = [],
}: SubjectDialogProps) => {
  const isEditing = !!subject;
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: classesResponse, isLoading: isLoadingClasses } =
    useGetClassSections();

  const classes: any[] = classesResponse?.data || [];

  const defaultValues: SubjectFormData = {
    classId: defaultClassId || "",
    name: "",
    code: "",
    description: "",
    teacherId: null,
  };

  const initialData: SubjectFormData = isEditing
    ? {
        classId: subject.classId,
        name: subject.name,
        code: subject.code,
        description: subject.description || "",
        teacherId: subject.teacherId || null,
      }
    : { ...defaultValues, classId: defaultClassId || "" };

  const onSubmit = (data: SubjectFormData) => {
    // Convert empty teacherId string to null
    const payload = {
      ...data,
      teacherId: data.teacherId || null,
      description: data.description || undefined,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: subject.id, data: payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Subject" : "Add Subject"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this subject."
              : "Create a new subject and optionally assign a teacher."}
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={subjectSchema}
          onSubmit={onSubmit}
          options={{
            defaultValues: initialData,
            values: initialData,
          }}
        >
          {(form) => (
            <div className="space-y-4 pt-2">
              {/* Class */}
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingClasses}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                            {cls.section ? ` — ${cls.section}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name & Code */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mathematics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. MATH-101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the subject..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assign Teacher */}
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Assign Teacher{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional)
                      </span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val === "__none__" ? null : val)
                      }
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="No teacher assigned" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">
                          No teacher assigned
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
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Save Changes" : "Create Subject"}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
