"use client ";
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
import { Switch } from "@/components/ui/switch";
import { academicYearSchema, AcademicYearFormData } from "../schemas/academics";
import { AcademicYear } from "../types";
import { useCreateAcademicYear, useUpdateAcademicYear } from "../api/years";

interface AcademicYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYear?: AcademicYear | null;
}

export const AcademicYearDialog = ({
  open,
  onOpenChange,
  academicYear,
}: AcademicYearDialogProps) => {
  const isEditing = !!academicYear;

  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: AcademicYearFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: academicYear.id, data },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const defaultValues = {
    name: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    status: "UPCOMING" as const,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Academic Year" : "Add Academic Year"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the academic year."
              : "Create a new academic year for the institution."}
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={academicYearSchema}
          onSubmit={onSubmit}
          options={{
            defaultValues: isEditing ? academicYear : defaultValues,
            values: (isEditing ? academicYear : defaultValues) as any,
          }}
        >
          {(form) => (
            <div className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2024-2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="UPCOMING">Upcoming</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Current Year</FormLabel>
                      <div className="text-xs text-muted-foreground">
                        Set as the currently active academic year
                      </div>
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
