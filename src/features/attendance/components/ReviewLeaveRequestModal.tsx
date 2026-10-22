"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  FileText,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { LeaveRequest } from "../types";
import { useReviewLeaveRequest } from "../api";
import { cn } from "@/lib/utils";

interface ReviewLeaveRequestModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leaveRequest: LeaveRequest | null;
  initialStatus?: "APPROVED" | "REJECTED" | null;
  onSuccess?: () => void;
}

export const ReviewLeaveRequestModal: React.FC<ReviewLeaveRequestModalProps> = ({
  isOpen,
  onOpenChange,
  leaveRequest,
  initialStatus,
  onSuccess,
}) => {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reviewNote, setReviewNote] = useState<string>("");

  // Sync state whenever dialog opens or leaveRequest changes
  useEffect(() => {
    if (isOpen && leaveRequest) {
      const targetStatus =
        initialStatus ||
        (leaveRequest.status === "REJECTED" ? "REJECTED" : "APPROVED");
      setStatus(targetStatus);

      if (leaveRequest.reviewNote) {
        setReviewNote(leaveRequest.reviewNote);
      } else if (targetStatus === "APPROVED") {
        setReviewNote("Approved. Take care and safe travels.");
      } else {
        setReviewNote("");
      }
    }
  }, [isOpen, leaveRequest, initialStatus]);

  const reviewMutation = useReviewLeaveRequest({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleStatusChange = (newStatus: "APPROVED" | "REJECTED") => {
    setStatus(newStatus);
    // Autofill polite default note if blank or switching between standard presets
    if (newStatus === "APPROVED" && (!reviewNote || reviewNote.includes("Rejected"))) {
      setReviewNote("Approved. Take care and safe travels.");
    } else if (newStatus === "REJECTED" && reviewNote.includes("Approved")) {
      setReviewNote("Leave request could not be approved at this time.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveRequest?.id) return;

    reviewMutation.mutate({
      id: leaveRequest.id,
      status,
      reviewNote: reviewNote.trim() ? reviewNote.trim() : undefined,
    });
  };

  if (!leaveRequest) return null;

  const isApproval = status === "APPROVED";

  // Calculate day difference if valid dates
  const calculateDays = () => {
    try {
      if (!leaveRequest?.fromDate || !leaveRequest?.toDate) return null;
      const from = new Date(leaveRequest.fromDate);
      const to = new Date(leaveRequest.toDate);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""}` : "1 day";
    } catch {
      return null;
    }
  };

  const dayDuration = calculateDays();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground border border-border shadow-lg p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "p-1.5 rounded-lg text-white",
                isApproval ? "bg-emerald-600" : "bg-rose-600"
              )}
            >
              {isApproval ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
            </span>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              {isApproval ? "Approve Leave Request" : "Reject Leave Request"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Review the application details and provide an optional note for the student and records.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Student Overview Card */}
          <div className="bg-muted/40 rounded-xl p-3.5 border border-border/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {leaveRequest.studentName || "Student"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {leaveRequest.className || "Class Enrolled"}
                    {leaveRequest.sectionName ? ` · Section ${leaveRequest.sectionName}` : ""}
                    {leaveRequest.rollNumber ? ` · Roll ${leaveRequest.rollNumber}` : ""}
                  </div>
                </div>
              </div>

              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-secondary text-secondary-foreground border border-border">
                {typeof leaveRequest.leaveType === "object"
                  ? (leaveRequest.leaveType as any)?.type || (leaveRequest.leaveType as any)?.name || "General Leave"
                  : String(leaveRequest.leaveType || "General Leave")}
              </span>
            </div>

            {/* Dates & Reason */}
            <div className="space-y-2 text-xs pt-1 border-t border-border/60">
              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>
                    {leaveRequest.fromDate} → {leaveRequest.toDate}
                  </span>
                </div>
                {dayDuration && (
                  <span className="font-semibold text-foreground text-[11px] bg-background px-2 py-0.5 rounded border border-border/60">
                    {dayDuration}
                  </span>
                )}
              </div>

              <div className="text-muted-foreground bg-background/80 p-2.5 rounded-lg border border-border/60 text-xs">
                <span className="font-semibold text-foreground block text-[11px] mb-0.5">
                  Reason for leave:
                </span>
                <p className="italic text-foreground/90 whitespace-pre-wrap">
                  "{leaveRequest.reason || "No detailed reason provided."}"
                </p>
              </div>

              {leaveRequest.documentUrl && (
                <div className="pt-1">
                  <a
                    href={leaveRequest.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Attached Medical / Supporting Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Decision Selector Buttons */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Review Decision
            </Label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleStatusChange("APPROVED")}
                className={cn(
                  "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                  isApproval
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30"
                    : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/60"
                )}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Approve Request</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange("REJECTED")}
                className={cn(
                  "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                  !isApproval
                    ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500 shadow-xs ring-1 ring-rose-500/30"
                    : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/60"
                )}
              >
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Reject Request</span>
              </button>
            </div>
          </div>

          {/* Review Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                Review Note (Optional)
              </Label>
              <span className="text-[10px] text-muted-foreground">
                Visible to student
              </span>
            </div>
            <Textarea
              rows={3}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder={
                isApproval
                  ? "Approved. Take care and safe travels."
                  : "State reason for rejecting this leave request..."
              }
              className="text-xs resize-none bg-background border-input rounded-xl"
            />

            {/* Quick Note Presets */}
            <div className="pt-1">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Quick templates:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(isApproval
                  ? [
                      "Approved. Take care and safe travels.",
                      "Approved. Submit medical certificate upon return.",
                      "Excused leave granted.",
                    ]
                  : [
                      "Leave request declined due to mandatory assessments.",
                      "Insufficient notice provided.",
                      "Please contact class teacher directly.",
                    ]
                ).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setReviewNote(preset)}
                    className="text-[10px] bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs rounded-xl"
              disabled={reviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={reviewMutation.isPending}
              className={cn(
                "text-xs font-semibold rounded-xl text-white shadow-xs transition-colors cursor-pointer",
                isApproval
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              )}
            >
              {reviewMutation.isPending ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : isApproval ? (
                "Confirm Approval"
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
