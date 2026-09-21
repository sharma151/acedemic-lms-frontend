"use client";
import { useMemo } from "react";
import { DefaultValues } from "react-hook-form";
import {
  Dialog,
  DialogContent,
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
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGetSubjectsByClass } from "@/features/academics/api/subjects";
import { useCreateTimetableSlot, useUpdateTimetableSlot } from "../api/timetable";
import { CreateSlotSchema, CreateSlotFormData } from "../schemas/timetable";
import { TimetableSlot, Period, WorkingDay, TimetableConfiguration } from "../types";
import { useSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { getTenantById } from "@/features/tenants/api/tenants";
import { QUERY_KEYS } from "@/configs/querykey";

interface AssignSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configuration: TimetableConfiguration;
  classId: string;
  day: WorkingDay | null;
  period: Period | null;
  existingSlot?: TimetableSlot | null;
}

export const AssignSlotDialog = ({
  open,
  onOpenChange,
  configuration,
  classId,
  day,
  period,
  existingSlot,
}: AssignSlotDialogProps) => {
  const tenantId = useSession((s) => s.tenantId);
  const { data: tenantResponse } = useQuery({
    queryKey: [QUERY_KEYS.TENANT_DETAILS, tenantId],
    queryFn: () => getTenantById(tenantId!),
    enabled: !!tenantId,
  });

  const teachers = useMemo(() => tenantResponse?.data?.users?.teachers || [], [tenantResponse]);

  const { data: subjectsResponse } = useGetSubjectsByClass(classId, { limit: 100 });
  const subjects = useMemo(() => subjectsResponse?.data || [], [subjectsResponse]);

  const createMutation = useCreateTimetableSlot();
  const updateMutation = useUpdateTimetableSlot();

  const isEditing = !!existingSlot;

  if (!day || !period) return null;

  const initialData: CreateSlotFormData = isEditing && existingSlot
    ? {
      academicYearId: configuration.academicYearId,
      timetableConfigurationId: configuration.id,
      classId,
      periodId: period.id,
      day: (day.day || (day as any).code || day.label).charAt(0).toUpperCase() + (day.day || (day as any).code || day.label).slice(1).toLowerCase(),
      startTime: period.startTime,
      endTime: period.endTime,
      subjectId: existingSlot.subjectId || existingSlot.subject?.id || "",
      primaryTeacherId: existingSlot.primaryTeacherId || existingSlot.primaryTeacher?.id || (!existingSlot.teacher?.isSubstitute ? existingSlot.teacher?.id : null) || null,
      secondaryTeacherId: existingSlot.secondaryTeacherId || existingSlot.secondaryTeacher?.id || null,
      tag: existingSlot.tag || "Theory",
      type: (existingSlot.type?.toLowerCase() || "period") as any,
      status: existingSlot.status?.toLowerCase() || "active",
      slot: existingSlot.slot || period.name,
      remark: existingSlot.remark || "",
    }
    : {
      academicYearId: configuration.academicYearId,
      timetableConfigurationId: configuration.id,
      classId,
      periodId: period.id,
      day: day.day.charAt(0).toUpperCase() + day.day.slice(1).toLowerCase(),
      startTime: period.startTime,
      endTime: period.endTime,
      subjectId: "",
      type: "period" as any,
      status: "active",
      slot: period.name,
      tag: "Theory",
    };

  const onSubmit = (data: CreateSlotFormData) => {
    if (isEditing && existingSlot) {
      const { timetableConfigurationId, periodId, ...updateData } = data;
      updateMutation.mutate({ id: existingSlot.id, data: updateData }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Slot" : "Assign Slot"}</DialogTitle>
        </DialogHeader>
        <Form schema={CreateSlotSchema} onSubmit={onSubmit} options={{ defaultValues: initialData, values: initialData }}>
          {(form) => (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm">
                  <span className="text-slate-500 block">Day</span>
                  <span className="font-medium">{day.label}</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500 block">Time</span>
                  <span className="font-medium">{period.startTime} - {period.endTime}</span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryTeacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Teacher</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val === "none" ? null : val)} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select teacher (optional)" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Default (from subject)</SelectItem>
                        {teachers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "Theory"}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Tag" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Theory">Theory</SelectItem>
                          <SelectItem value="Practical">Practical</SelectItem>
                          <SelectItem value="Lab">Lab</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark/Room</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Room 101" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Save Changes" : "Assign"}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
