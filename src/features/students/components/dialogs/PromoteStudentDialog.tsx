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

import { promoteStudentSchema, PromoteStudentFormData } from "../../schemas/students";
import { usePromoteStudent } from "../../api/students";
import { StudentEnrollment } from "../../types";
import { useGetAcademicYears } from "@/features/academics/api/years";
import { useGetClassSections } from "@/features/academics/api/classes";

interface PromoteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  currentEnrollment?: StudentEnrollment;
}

export const PromoteStudentDialog = ({
  open,
  onOpenChange,
  studentId,
  currentEnrollment,
}: PromoteStudentDialogProps) => {
  const promoteMutation = usePromoteStudent(studentId);
  const { data: yearsResponse, isLoading: isLoadingYears } = useGetAcademicYears();
  const { data: classesResponse, isLoading: isLoadingClasses } = useGetClassSections();
  
  const years = yearsResponse?.data || [];
  const classes = classesResponse?.data || [];
  const availableYears = years.filter(y => y.status !== "COMPLETED");

  const defaultValues = {
    academicYearId: "",
    classId: "",
    rollNumber: "" as unknown as number,
    previousYearResult: "",
    remarks: "",
  };

  const onSubmit = (data: PromoteStudentFormData) => {
    promoteMutation.mutate(
      { id: studentId, data },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Promote / Change Class</DialogTitle>
          <DialogDescription>
            Record the outcome of the current year and enroll the student in a new class.
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={promoteStudentSchema}
          onSubmit={onSubmit}
          options={{ defaultValues, values: defaultValues }}
        >
          {(form) => (
            <div className="space-y-4 pt-2">
              {currentEnrollment && (
                <div className="bg-slate-50 p-3 rounded-lg border text-sm text-slate-700 mb-4">
                  <span className="font-semibold">Current:</span> {currentEnrollment.class?.name || "Unknown"} (Roll: {currentEnrollment.rollNumber}) in {currentEnrollment.academicYear?.name}
                </div>
              )}
              
              <FormField
                control={form.control}
                name="previousYearResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Year Result</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. PASS, FAIL, 85%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="academicYearId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Academic Year</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} disabled={isLoadingYears}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {availableYears.map(y => (
                            <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Class</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} disabled={isLoadingClasses}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section})` : ""}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Roll Number</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Roll Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Any notes on promotion..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={promoteMutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={promoteMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700">
                  {promoteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Promotion
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
