"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { CalendarDayAttendance, AttendanceStatus } from "../types";
import { cn } from "@/lib/utils";

interface AttendanceCalendarProps {
  daysData?: CalendarDayAttendance[];
  currentDate?: Date;
  onMonthChange?: (month: number, year: number) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  daysData = [],
  currentDate = new Date(),
  onMonthChange,
}) => {
  const [activeDate, setActiveDate] = useState<Date>(currentDate);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth(); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    setActiveDate(prev);
    onMonthChange?.(prev.getMonth() + 1, prev.getFullYear());
  };

  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    setActiveDate(next);
    onMonthChange?.(next.getMonth() + 1, next.getFullYear());
  };

  // Build grid for month
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create date lookup map
  const statusMap = new Map<number, AttendanceStatus | "HOLIDAY">();
  daysData.forEach((item) => {
    const d = new Date(item.date);
    if (d.getFullYear() === year && d.getMonth() === month && item.status) {
      statusMap.set(d.getDate(), item.status);
    }
  });

  const getDotColor = (status?: AttendanceStatus | "HOLIDAY") => {
    switch (status) {
      case "PRESENT":
        return "bg-emerald-500";
      case "ABSENT":
        return "bg-rose-500";
      case "LATE":
        return "bg-amber-500";
      case "EXCUSED":
        return "bg-purple-500";
      case "HOLIDAY":
        return "bg-slate-300";
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 border border-border/80 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              {monthNames[month]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 text-center gap-y-1">
          {/* Leading blank days */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`blank-${i}`} className="h-8" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const status = statusMap.get(dayNum);
            const dotColor = getDotColor(status);
            const isToday = dayNum === new Date().getDate();

            return (
              <div
                key={`day-${dayNum}`}
                className="flex flex-col items-center justify-center h-8 relative cursor-pointer"
              >
                <span
                  className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full transition-all",
                    isToday
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {dayNum}
                </span>
                {dotColor && (
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full absolute bottom-0.5",
                      dotColor
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Late
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Excused
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300" /> Holiday
        </span>
      </div>
    </div>
  );
};
