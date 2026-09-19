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
import { WorkingDayFormSchema, WorkingDayFormData } from "../schemas/timetable";
import { WorkingDay } from "../types";
import { useCreateWorkingDay, useUpdateWorkingDay } from "../api/timetable";

interface WorkingDayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configurationId: string;
  workingDay?: WorkingDay | null;
}

const DAY_OPTIONS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export const WorkingDayDialog = ({
  open,
  onOpenChange,
  configurationId,
  workingDay,
}: WorkingDayDialogProps) => {
  const isEditing = !!workingDay;

  const createMutation = useCreateWorkingDay(configurationId);
  const updateMutation = useUpdateWorkingDay(configurationId);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: WorkingDayFormData) => {
    if (isEditing) {
      const { day, ...updateData } = data;
      updateMutation.mutate(
        { configurationId, dayId: workingDay.id, data: updateData },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(
        { configurationId, data },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  const defaultValues: WorkingDayFormData = {
    day: "MONDAY",
    label: "Monday",
    isWorkingDay: true,
    displayOrder: 1,
  };

  const currentValues = isEditing
    ? {
        day: workingDay.day,
        label: workingDay.label,
        isWorkingDay: workingDay.isWorkingDay,
        displayOrder: workingDay.displayOrder,
      }
    : defaultValues;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Working Day" : "Add Working Day"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the working day."
              : "Add a new day to the timetable."}
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={WorkingDayFormSchema}
          onSubmit={onSubmit}
          options={{
            defaultValues: currentValues,
            values: currentValues as any,
          }}
        >
          {(form) => (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day</FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          // Auto-fill label if empty or matching default
                          const dayOpt = DAY_OPTIONS.find(d => d.value === val);
                          if (dayOpt && (!form.getValues("label") || DAY_OPTIONS.some(d => d.label === form.getValues("label")))) {
                            form.setValue("label", dayOpt.label);
                          }
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DAY_OPTIONS.map((d) => (
                            <SelectItem key={d.value} value={d.value.toString()}>
                              {d.label}
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
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Monday" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isWorkingDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-[72px] mt-2">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Working Day</FormLabel>
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
