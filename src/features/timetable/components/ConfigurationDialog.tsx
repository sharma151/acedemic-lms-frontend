"use client";
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
import { ConfigurationFormSchema, ConfigurationFormData } from "../schemas/timetable";
import { TimetableConfiguration } from "../types";
import { useCreateConfiguration, useUpdateConfiguration } from "../api/timetable";
import { useGetAcademicYears } from "@/features/academics/api/years";

interface ConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configuration?: TimetableConfiguration | null;
}

export const ConfigurationDialog = ({
  open,
  onOpenChange,
  configuration,
}: ConfigurationDialogProps) => {
  const isEditing = !!configuration;

  const createMutation = useCreateConfiguration();
  const updateMutation = useUpdateConfiguration(configuration?.id);

  const { data: academicYearsData, isLoading: isLoadingYears } = useGetAcademicYears();
  const academicYears = academicYearsData?.data || [];

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: ConfigurationFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: configuration.id, data },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const defaultValues: ConfigurationFormData = {
    name: "",
    academicYearId: "",
    status: "DRAFT",
    isDefault: false,
  };

  const currentValues = isEditing
    ? {
        name: configuration.name,
        academicYearId: configuration.academicYearId,
        status: configuration.status,
        isDefault: configuration.isDefault,
      }
    : defaultValues;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Timetable Configuration" : "Add Timetable Configuration"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the timetable configuration."
              : "Create a new timetable configuration."}
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={ConfigurationFormSchema}
          onSubmit={onSubmit}
          options={{
            defaultValues: currentValues,
            values: currentValues as any,
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
                      <Input placeholder="e.g. Regular Schedule 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicYearId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={isLoadingYears}>
                          <SelectValue placeholder="Select Academic Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicYears.map((year) => (
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
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Default Configuration</FormLabel>
                      <div className="text-xs text-muted-foreground">
                        Set as the default timetable for this academic year
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
