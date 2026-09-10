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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classSectionSchema, ClassSectionFormData } from "../schemas/academics";
import { ClassSection, AcademicYear } from "../types";
import { useCreateClassSection, useUpdateClassSection } from "../api/classes";
import { useGetAcademicYears } from "../api/years";

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classSection?: ClassSection | null;
}

export const ClassDialog = ({
  open,
  onOpenChange,
  classSection,
}: ClassDialogProps) => {
  const isEditing = !!classSection;

  const createMutation = useCreateClassSection();
  const updateMutation = useUpdateClassSection();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: yearsResponse, isLoading: isLoadingYears } =
    useGetAcademicYears();
  const years = yearsResponse?.data || [];
  // Filter for active/upcoming years to show in the dropdown, or include the currently selected one if editing
  const availableYears = years.filter(
    (y: AcademicYear) =>
      y.status !== "COMPLETED" ||
      (isEditing && y.id === classSection.academicYearId),
  );

  const onSubmit = (data: ClassSectionFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: classSection.id, data },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const defaultValues = {
    academicYearId: "",
    name: "",
    section: "",
  };

  const initialData = isEditing
    ? {
        academicYearId: classSection.academicYearId,
        name: classSection.name,
        section: classSection.section || "",
      }
    : defaultValues;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Class & Section" : "Add Class & Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the class."
              : "Create a new class for the academic year."}
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={classSectionSchema}
          onSubmit={onSubmit}
          options={{
            defaultValues: initialData,
            values: initialData,
          }}
        >
          {(form) => (
            <div className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="academicYearId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingYears || isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableYears.map((year: AcademicYear) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Class 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. A, B, Science" {...field} />
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
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Save Changes" : "Create"}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
