"use client";
import { useEffect } from "react";
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
import { PeriodFormSchema, PeriodFormData } from "../schemas/timetable";
import { Period } from "../types";
import { useCreatePeriod, useUpdatePeriod } from "../api/timetable";

interface PeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configurationId: string;
  period?: Period | null;
}

export const PeriodDialog = ({
  open,
  onOpenChange,
  configurationId,
  period,
}: PeriodDialogProps) => {
  const isEditing = !!period;

  const createMutation = useCreatePeriod(configurationId);
  const updateMutation = useUpdatePeriod(configurationId);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: PeriodFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { configurationId, periodId: period.id, data },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(
        { configurationId, data },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  const defaultValues: PeriodFormData = {
    name: "",
    shortName: "",
    startTime: "09:00",
    endTime: "09:45",
    type: "PERIOD",
    displayOrder: 1,
  };

  const currentValues = isEditing
    ? {
        name: period.name,
        shortName: period.shortName || "",
        startTime: period.startTime,
        endTime: period.endTime,
        type: period.type,
        displayOrder: period.displayOrder,
      }
    : defaultValues;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Period" : "Add Period"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the period."
              : "Create a new period or break."}
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={PeriodFormSchema}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Period 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. P1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PERIOD">Class Period</SelectItem>
                          <SelectItem value="BREAK">Break</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
