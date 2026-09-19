"use client";
import React from "react";
import { useGetWorkingDays, useGetPeriods } from "../api/timetable";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleMatrixTabProps {
  configurationId: string;
}

export const ScheduleMatrixTab = ({ configurationId }: ScheduleMatrixTabProps) => {
  const { data: days = [], isLoading: isLoadingDays } = useGetWorkingDays(configurationId);
  const { data: periods = [], isLoading: isLoadingPeriods } = useGetPeriods(configurationId);

  if (isLoadingDays || isLoadingPeriods) {
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

  return (
    <div className="mt-6 overflow-x-auto pb-4">
      <div className="min-w-[800px] border rounded-lg bg-white overflow-hidden shadow-sm">
        {/* Header Row: Days */}
        <div className="flex border-b bg-slate-50/80">
          <div className="w-32 shrink-0 border-r p-4 font-semibold text-slate-600 text-sm flex items-center justify-center">
            Time \ Day
          </div>
          {workingDays.map((day) => (
            <div key={day.id} className="flex-1 min-w-[120px] p-4 text-center font-semibold text-slate-700 text-sm border-r last:border-r-0">
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
                  /* Break Row spans across all days */
                  <div className="flex-1 p-4 flex items-center justify-center bg-amber-50/40 border-r last:border-r-0 text-amber-700 group-hover:bg-amber-50/80 transition-colors">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium text-sm">{period.name}</span>
                    </div>
                  </div>
                ) : (
                  /* Normal Period Cells */
                  workingDays.map((day) => (
                    <div key={`${period.id}-${day.id}`} className="flex-1 min-w-[120px] p-2 border-r last:border-r-0 group-hover:bg-slate-50/30 transition-colors flex items-center justify-center">
                      <div className="w-full h-full min-h-[60px] rounded border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                        {/* Placeholder for future class assignments */}
                        <Badge variant="outline" className="text-slate-300 border-slate-200 font-normal">
                          Available Slot
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
