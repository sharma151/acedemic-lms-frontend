"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  FileText,
  ExternalLink,
  Calendar,
  User,
  Filter,
  Check,
  X,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LeaveRequest, LeaveStatus } from "../types";
import { useLeaveRequests } from "../api";
import { ReviewLeaveRequestModal } from "./ReviewLeaveRequestModal";

interface LeaveRequestsReviewSectionProps {
  userRole?: "Teacher" | "Admin";
  classId?: string;
  sectionId?: string;
}

export const LeaveRequestsReviewSection: React.FC<LeaveRequestsReviewSectionProps> = ({
  userRole = "Admin",
}) => {
  const [statusFilter, setStatusFilter] = useState<"ALL" | LeaveStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // TanStack Query for Leave Requests
  const {
    data: requestsData,
    isLoading,
    isRefetching,
    refetch,
  } = useLeaveRequests();

  const allRequests = useMemo(() => {
    return Array.isArray(requestsData) ? requestsData : [];
  }, [requestsData]);

  // Metric counts
  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    allRequests.forEach((req) => {
      const st = String(req?.status || "").toUpperCase();
      if (st === "PENDING") pending += 1;
      else if (st === "APPROVED") approved += 1;
      else if (st === "REJECTED") rejected += 1;
    });
    return {
      total: allRequests.length,
      pending,
      approved,
      rejected,
    };
  }, [allRequests]);

  // Filtered requests based on filter pill & search input
  const filteredRequests = useMemo(() => {
    return allRequests.filter((req) => {
      const st = String(req?.status || "").toUpperCase();
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : st === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const studentName = String(req?.studentName || "").toLowerCase();
      const roll = String(req?.rollNumber || "").toLowerCase();
      const reason = String(req?.reason || "").toLowerCase();
      const leaveType = String(req?.leaveType || "").toLowerCase();
      const matchesSearch =
        !q ||
        studentName.includes(q) ||
        roll.includes(q) ||
        reason.includes(q) ||
        leaveType.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [allRequests, statusFilter, searchQuery]);

  const handleOpenReview = (request: LeaveRequest, action: "APPROVED" | "REJECTED") => {
    setSelectedRequest(request);
    setReviewAction(action);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 shadow-xs p-6 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold text-foreground">
              Student Leave Applications
            </h3>
            {counts.pending > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {counts.pending} Pending Review
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluate, approve, or reject student excused leave requests with optional review notes.
          </p>
        </div>

        {/* Refetch Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching || isLoading}
          className="text-xs font-semibold rounded-xl h-8 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", (isRefetching || isLoading) && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Metric Counters Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all cursor-pointer",
            statusFilter === "ALL"
              ? "bg-primary/5 border-primary/40 ring-1 ring-primary/30"
              : "bg-muted/20 border-border/70 hover:bg-muted/40"
          )}
        >
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">
            Total Requests
          </div>
          <div className="text-2xl font-bold text-foreground mt-0.5">
            {counts.total}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("PENDING")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all cursor-pointer",
            statusFilter === "PENDING"
              ? "bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30"
              : "bg-muted/20 border-border/70 hover:bg-muted/40"
          )}
        >
          <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase flex items-center justify-between">
            <span>Pending</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-0.5">
            {counts.pending}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("APPROVED")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all cursor-pointer",
            statusFilter === "APPROVED"
              ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30"
              : "bg-muted/20 border-border/70 hover:bg-muted/40"
          )}
        >
          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase flex items-center justify-between">
            <span>Approved</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
            {counts.approved}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("REJECTED")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all cursor-pointer",
            statusFilter === "REJECTED"
              ? "bg-rose-500/10 border-rose-500/50 ring-1 ring-rose-500/30"
              : "bg-muted/20 border-border/70 hover:bg-muted/40"
          )}
        >
          <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase flex items-center justify-between">
            <span>Rejected</span>
            <XCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-0.5">
            {counts.rejected}
          </div>
        </button>
      </div>

      {/* Filter Toolbar (Search & Filter state) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border",
                statusFilter === st
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-background text-muted-foreground border-input hover:bg-muted hover:text-foreground"
              )}
            >
              {st === "ALL" ? "All Applications" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by student, roll, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs bg-background border-input rounded-xl h-8"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/30">
              <th className="py-3 px-4 font-semibold">Student</th>
              <th className="py-3 px-4 font-semibold">Leave Period</th>
              <th className="py-3 px-4 font-semibold">Type &amp; Reason</th>
              <th className="py-3 px-4 font-semibold">Applied On</th>
              <th className="py-3 px-4 text-center font-semibold">Status</th>
              <th className="py-3 px-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Loading leave applications...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Clock className="w-8 h-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-foreground">
                      No leave requests found
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {searchQuery
                        ? `No leave requests match "${searchQuery}".`
                        : statusFilter !== "ALL"
                        ? `There are currently no leave requests with status "${statusFilter}".`
                        : "No students have applied for leave yet."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const statusUpper = String(req?.status || "PENDING").toUpperCase();
                const isPending = statusUpper === "PENDING";
                const isApproved = statusUpper === "APPROVED";
                const isRejected = statusUpper === "REJECTED";

                const initials = String(req?.studentName || "ST")
                  .trim()
                  .split(/\s+/)
                  .map((n) => n[0] || "")
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "ST";

                const appliedDate = req?.appliedOn
                  ? String(req.appliedOn).split("T")[0]
                  : "—";

                return (
                  <tr
                    key={req.id || String(Math.random())}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {req.studentName || "Student"}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {req.className || "Class"}
                            {req.sectionName ? ` · ${req.sectionName}` : ""}
                            {req.rollNumber ? ` · Roll ${req.rollNumber}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Leave Period */}
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-foreground font-semibold text-xs">
                        <Calendar className="w-3 h-3 text-primary shrink-0" />
                        <span>
                          {String(req?.fromDate || "—")} → {String(req?.toDate || "—")}
                        </span>
                      </div>
                    </td>

                    {/* Type & Reason */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-secondary text-[10px] font-semibold text-secondary-foreground border border-border">
                          {typeof req.leaveType === "object"
                            ? (req.leaveType as any)?.type || (req.leaveType as any)?.name || "Leave"
                            : String(req.leaveType || "Leave")}
                        </span>
                        <p className="text-foreground text-xs line-clamp-2">
                          {req.reason}
                        </p>
                        {req.reviewNote && (
                          <div className="flex items-start gap-1 text-[11px] text-muted-foreground italic bg-muted/40 p-1.5 rounded border border-border/50">
                            <MessageSquare className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                            <span>Note: "{req.reviewNote}"</span>
                          </div>
                        )}
                        {req.documentUrl && (
                          <a
                            href={req.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Attachment</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3.5 px-4 font-mono text-muted-foreground whitespace-nowrap">
                      {appliedDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> APPROVED
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          <Button
                            size="sm"
                            onClick={() => handleOpenReview(req, "APPROVED")}
                            className="h-7 px-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer shadow-xs"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>

                          {/* Reject Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenReview(req, "REJECTED")}
                            className="h-7 px-2.5 text-xs font-semibold border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleOpenReview(
                              req,
                              isApproved ? "APPROVED" : "REJECTED"
                            )
                          }
                          className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
                        >
                          Update Decision
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review Dialog */}
      <ReviewLeaveRequestModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        leaveRequest={selectedRequest}
        initialStatus={reviewAction}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};
