"use client";
import { useMemo } from "react";
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
import { useAssignSubstituteTeacher } from "../api/timetable";
import { AssignSubstituteSchema, AssignSubstituteFormData } from "../schemas/timetable";
import { TimetableSlot } from "../types";
import { useSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { getTenantById } from "@/features/tenants/api/tenants";
import { QUERY_KEYS } from "@/configs/querykey";

interface AssignSubstituteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: TimetableSlot | null;
}

export const AssignSubstituteDialog = ({
  open,
  onOpenChange,
  slot,
}: AssignSubstituteDialogProps) => {
  const tenantId = useSession((s) => s.tenantId);
  const { data: tenantResponse } = useQuery({
    queryKey: [QUERY_KEYS.TENANT_DETAILS, tenantId],
    queryFn: () => getTenantById(tenantId!),
    enabled: !!tenantId,
  });

  const teachers = useMemo(() => tenantResponse?.data?.users?.teachers || [], [tenantResponse]);
  const mutation = useAssignSubstituteTeacher();

  if (!slot) return null;

  const initialData: AssignSubstituteFormData = {
    secondaryTeacherId: slot.secondaryTeacherId || slot.substituteTeacherId || "",
  };

  const onSubmit = (data: AssignSubstituteFormData) => {
    mutation.mutate(
      { id: slot.id, data },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Substitute</DialogTitle>
        </DialogHeader>
        <Form schema={AssignSubstituteSchema} onSubmit={onSubmit} options={{ defaultValues: initialData, values: initialData }}>
          {(form) => (
            <div className="space-y-4 pt-2">
              <div className="text-sm bg-slate-50 p-3 rounded-md border border-slate-100 mb-2">
                <div className="mb-1">
                  <span className="text-slate-500">Subject: </span>
                  <span className="font-medium">{slot.subject?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Time: </span>
                  <span className="font-medium">{slot.startTime} - {slot.endTime} ({slot.day})</span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="secondaryTeacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Substitute Teacher</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a substitute" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Assign Substitute
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
