"use client";

import React, { useState } from "react";
import { GraduationCap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { useStudentHistory } from "../../api/students";
import { StudentEnrollment, StudentHistory } from "../../types";
import { PromoteStudentDialog } from "../dialogs/PromoteStudentDialog";
import { Badge } from "@/components/ui/badge";

interface AcademicHistoryTabProps {
  studentId: string;
  currentEnrollment?: StudentEnrollment;
}

export const AcademicHistoryTab = ({ studentId, currentEnrollment }: AcademicHistoryTabProps) => {
  const { data: history = [], isLoading } = useStudentHistory(studentId);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  const columns: ColumnDef<StudentHistory>[] = [
    {
      header: "Academic Year",
      cell: (h) => h.academicYear?.name || h.academicYearId,
    },
    {
      header: "Class & Section",
      cell: (h) => h.class?.name ? `${h.class.name} ${h.class.section ? `(${h.class.section})` : ""}` : h.classId,
    },
    {
      header: "Roll Number",
      accessorKey: "rollNumber",
    },
    {
      header: "Result/Status",
      cell: (h) => {
        if (!h.previousYearResult) return <span className="text-muted-foreground">—</span>;
        return (
          <Badge variant="outline" className="bg-slate-50">
            {h.previousYearResult}
          </Badge>
        );
      },
    },
    {
      header: "Remarks",
      cell: (h) => h.remarks || <span className="text-muted-foreground">—</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-50 border-slate-200 shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center border border-slate-200">
              <GraduationCap className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Current Academic Enrollment</p>
              {currentEnrollment ? (
                <p className="text-lg font-bold text-slate-900">
                  {currentEnrollment.class?.name || "Unknown Class"} 
                  {currentEnrollment.class?.section ? ` (${currentEnrollment.class.section})` : ""} 
                  <span className="text-slate-400 mx-2">•</span> 
                  Roll {currentEnrollment.rollNumber}
                  <span className="text-slate-400 mx-2">•</span> 
                  {currentEnrollment.academicYear?.name}
                </p>
              ) : (
                <p className="text-lg font-semibold text-slate-700">Not Currently Enrolled</p>
              )}
            </div>
          </div>
          <Button onClick={() => setIsPromoteOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Promote / Change Class
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Enrollment History</CardTitle>
          <CardDescription>A timeline of classes and results for this student.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={history}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No academic history found."
          />
        </CardContent>
      </Card>

      <PromoteStudentDialog
        open={isPromoteOpen}
        onOpenChange={setIsPromoteOpen}
        studentId={studentId}
        currentEnrollment={currentEnrollment}
      />
    </div>
  );
};
