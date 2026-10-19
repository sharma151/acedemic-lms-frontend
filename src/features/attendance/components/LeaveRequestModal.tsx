"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  leaveRequestSchema,
  LeaveRequestFormData,
} from "../schemas/attendance.schema";
import { useCreateLeaveRequest } from "../api";
import { Plus } from "lucide-react";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStudentId?: string;
  onSuccess?: () => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onOpenChange,
  defaultStudentId = "st-1",
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      student_id: defaultStudentId,
      leave_type: "Sick",
      from_date: "",
      to_date: "",
      reason: "",
      document_url: "",
    },
  });

  const createLeaveMutation = useCreateLeaveRequest({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const onSubmit = (data: LeaveRequestFormData) => {
    createLeaveMutation.mutate({
      student_id: data.student_id,
      from_date: data.from_date,
      to_date: data.to_date,
      leave_type: data.leave_type,
      reason: data.reason,
      document_url: data.document_url || null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Apply for Student Leave
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Submit a formal leave request for administrative approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Leave Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Leave Type</Label>
            <Select
              defaultValue="Sick"
              onValueChange={(val) => setValue("leave_type", val, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sick">Sick Leave</SelectItem>
                <SelectItem value="Casual">Casual Leave</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.leave_type && (
              <p className="text-xs text-rose-500">{errors.leave_type.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">From Date</Label>
              <Input
                type="date"
                className="text-xs"
                {...register("from_date")}
              />
              {errors.from_date && (
                <p className="text-xs text-rose-500">{errors.from_date.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">To Date</Label>
              <Input
                type="date"
                className="text-xs"
                {...register("to_date")}
              />
              {errors.to_date && (
                <p className="text-xs text-rose-500">{errors.to_date.message}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Reason</Label>
            <Textarea
              placeholder="Provide a detailed reason for leave..."
              rows={3}
              className="text-xs resize-none"
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-xs text-rose-500">{errors.reason.message}</p>
            )}
          </div>

          {/* Document Attachment (Optional) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Supporting Document URL (Optional)
            </Label>
            <Input
              type="url"
              placeholder="https://... (medical note or certificate)"
              className="text-xs"
              {...register("document_url")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createLeaveMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {createLeaveMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
