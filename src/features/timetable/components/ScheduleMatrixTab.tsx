"use client";
import React, { useState, useMemo } from "react";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useGetWorkingDays, useGetPeriods, useGetWeeklyMatrix, useDeleteTimetableSlot, useGetConfiguration } from "../api/timetable";
import { useGetClassSections } from "@/features/academics/api/classes";
import { Loader2, Plus, Edit2, UserCog, Trash2, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AssignSlotDialog } from "./AssignSlotDialog";
import { AssignSubstituteDialog } from "./AssignSubstituteDialog";
import { TimetableSlot, Period, WorkingDay } from "../types";
import useFilterSearch from "@/hooks/use-filter-search";

interface ScheduleMatrixTabProps {
  configurationId: string;
}

export const ScheduleMatrixTab = ({ configurationId }: ScheduleMatrixTabProps) => {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  
  const { renderSearch: renderTeacherSearch, debouncedSearch: debouncedTeacherName } = useFilterSearch({
    id: "teacher-search",
    placeholder: "Search by teacher name...",
    className: "w-full sm:w-64",
  });

  const { data: config } = useGetConfiguration(configurationId);
  const { data: days = [], isLoading: isLoadingDays } = useGetWorkingDays(configurationId);
  const { data: periods = [], isLoading: isLoadingPeriods } = useGetPeriods(configurationId);
  const { data: classesResponse, isLoading: isLoadingClasses } = useGetClassSections({ limit: 100 });
  const classes = classesResponse?.data || [];

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const { data: matrixResponse, isLoading: isLoadingMatrix } = useGetWeeklyMatrix({
    timetableConfigurationId: configurationId,
    className: selectedClass?.name,
    teacherName: debouncedTeacherName || undefined,
    classId: selectedClassId, // keeping classId here just in case, but it's omitted in getWeeklyMatrix
  });

  const slots = matrixResponse?.slots || [];
  const deleteMutation = useDeleteTimetableSlot();

  // Modals state
  const slotDialog = useDisclosure();
  const [selectedDay, setSelectedDay] = useState<WorkingDay | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  const [substituteSlot, setSubstituteSlot] = useState<TimetableSlot | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<TimetableSlot | null>(null);

  if (isLoadingDays || isLoadingPeriods || isLoadingClasses) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const workingDays = days.filter((d) => d.isWorkingDay).sort((a, b) => a.displayOrder - b.displayOrder);
  const sortedPeriods = [...periods].sort((a, b) => a.displayOrder - b.displayOrder);

  if (workingDays.length === 0 || sortedPeriods.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center mt-4">
        <div className="rounded-full bg-slate-100 p-3 mb-4">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Incomplete Configuration</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Please add both working days and periods in their respective tabs to view the schedule matrix.
        </p>
      </Card>
    );
  }

  const handleEmptyCellClick = (day: WorkingDay, period: Period) => {
    setSelectedDay(day);
    setSelectedPeriod(period);
    setEditingSlot(null);
    slotDialog.open();
  };

  const handleEditSlot = (slot: TimetableSlot, day: WorkingDay, period: Period) => {
    setSelectedDay(day);
    setSelectedPeriod(period);
    setEditingSlot(slot);
    slotDialog.open();
  };

  return (
    <div className="mt-4 space-y-4 pb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Class:</span>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="w-full sm:w-64 bg-white">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} {cls.section ? `— ${cls.section}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Teacher:</span>
          {renderTeacherSearch()}
        </div>

        {isLoadingMatrix && <Loader2 className="h-4 w-4 animate-spin text-slate-400 ml-auto" />}
      </div>

      {!selectedClassId && !debouncedTeacherName ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center mt-4">
          <div className="rounded-full bg-slate-100 p-3 mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No Filter Applied</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Select a class or search by teacher name to view the schedule periods.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px] border rounded-lg bg-white overflow-hidden shadow-sm">
            {/* Header Row: Days */}
            <div className="flex border-b bg-slate-50/80">
              <div className="w-32 shrink-0 border-r p-4 font-semibold text-slate-600 text-sm flex items-center justify-center">
                Time \ Day
              </div>
              {workingDays.map((day) => (
                <div key={day.id} className="flex-1 min-w-[140px] p-4 text-center font-semibold text-slate-700 text-sm border-r last:border-r-0">
                  {day.label}
                </div>
              ))}
            </div>

            {/* Body Rows: Periods */}
            <div className="flex flex-col">
              {sortedPeriods.map((period) => {
                const isBreak = period.type === "BREAK";
                return (
                  <div key={period.id} className="flex border-b last:border-b-0 group">
                    {/* Period Time Column */}
                    <div className="w-32 shrink-0 border-r p-3 flex flex-col items-center justify-center bg-slate-50/50 group-hover:bg-slate-100/50 transition-colors">
                      <span className="font-medium text-slate-800 text-sm">
                        {period.shortName || period.name}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        {period.startTime} - {period.endTime}
                      </span>
                    </div>

                    {/* Day Columns */}
                    {isBreak ? (
                      <div className="flex-1 p-4 flex items-center justify-center bg-amber-50/40 border-r last:border-r-0 text-amber-700 group-hover:bg-amber-50/80 transition-colors">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="font-medium text-sm">{period.name}</span>
                        </div>
                      </div>
                    ) : (
                      workingDays.map((day) => {
                        const dayValue = day.day || (day as any).code || day.label;
                        const slot = slots.find((s) => s.periodId === period.id && s.day?.toLowerCase() === dayValue?.toLowerCase());

                        return (
                          <div key={`${period.id}-${day.id}`} className="flex-1 min-w-[140px] p-2 border-r last:border-r-0 group-hover:bg-slate-50/30 transition-colors flex flex-col relative h-full min-h-[90px]">
                            {slot ? (
                              <div className={`flex flex-col w-full h-full rounded border p-2 ${slot.teacher?.isSubstitute || slot.substituteTeacherId ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <div className="flex justify-between items-start">
                                  <span className="font-semibold text-xs text-slate-800 line-clamp-1">{slot.subject?.name || slot.subjectId}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-5 w-5 p-0 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 shrink-0">
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                      <DropdownMenuItem onClick={() => handleEditSlot(slot, day, period)}>
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => setSubstituteSlot(slot)}>
                                        <UserCog className="mr-2 h-4 w-4" /> Substitute
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeletingSlot(slot)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <div className="mt-1 text-[11px] text-slate-500 truncate">
                                  {slot.teacher?.isSubstitute || slot.substituteTeacherId ? (
                                    <span className="text-orange-600 font-medium flex items-center">
                                      Sub: {slot.teacher?.name || slot.substituteTeacher?.firstName || "Assigned"}
                                    </span>
                                  ) : (
                                    <span>{slot.teacher?.name || slot.primaryTeacher?.firstName || "No Teacher"}</span>
                                  )}
                                </div>
                                <div className="mt-auto pt-1 flex items-center justify-between">
                                  <Badge variant="outline" className="text-[10px] h-4 px-1">{slot.tag || "Theory"}</Badge>
                                  {slot.remark && <span className="text-[10px] text-slate-400 truncate ml-1 max-w-[50px]">{slot.remark}</span>}
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleEmptyCellClick(day, period)}
                                className="w-full h-full min-h-[70px] rounded border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50/50 transition-colors cursor-pointer group/btn"
                              >
                                <Plus className="w-4 h-4 mb-1 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <span className="text-xs font-medium">Available Slot</span>
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {config && selectedDay && selectedPeriod && (
        <AssignSlotDialog
          open={slotDialog.isOpen}
          onOpenChange={(open) => {
            if (open) slotDialog.open();
            else slotDialog.close();
            if (!open) {
              setTimeout(() => {
                setSelectedDay(null);
                setSelectedPeriod(null);
                setEditingSlot(null);
              }, 300);
            }
          }}
          configuration={config}
          classId={selectedClassId}
          day={selectedDay}
          period={selectedPeriod}
          existingSlot={editingSlot}
        />
      )}

      <AssignSubstituteDialog
        open={!!substituteSlot}
        onOpenChange={(open) => {
          if (!open) setTimeout(() => setSubstituteSlot(null), 300);
        }}
        slot={substituteSlot}
      />

      <ConfirmDialog
        isOpen={!!deletingSlot}
        onClose={() => setDeletingSlot(null)}
        onConfirm={() => {
          if (deletingSlot) {
            deleteMutation.mutate(deletingSlot.id, {
              onSuccess: () => setDeletingSlot(null),
              onError: () => setDeletingSlot(null),
            });
          }
        }}
        title="Remove Slot?"
        description="Are you sure you want to remove this timetable slot? This will clear the class and teacher assignment for this period."
        confirmText="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
