"use client";

import React from "react";

interface AttendanceRingChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export const AttendanceRingChart: React.FC<AttendanceRingChartProps> = ({
  percentage,
  size = 130,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on threshold
  let strokeColor = "#10b981"; // Green (Safe)
  if (percentage < 75) {
    strokeColor = "#ef4444"; // Red (Danger)
  } else if (percentage < 85) {
    strokeColor = "#06b6d4"; // Cyan/Teal matching screenshot 2
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-muted/60"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Centered Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-foreground tracking-tight">
          {percentage}%
        </span>
        <span className="text-[11px] font-semibold text-muted-foreground -mt-0.5">
          Overall
        </span>
      </div>
    </div>
  );
};
