"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentDetails } from "../api/students";

import { ProfileTab } from "./tabs/ProfileTab";
import { AcademicHistoryTab } from "./tabs/AcademicHistoryTab";
import { ParentsTab } from "./tabs/ParentsTab";

interface StudentDetailsPageTemplateProps {
  studentId: string;
  basePath: string;
}

export const StudentDetailsPageTemplate = ({
  studentId,
  basePath,
}: StudentDetailsPageTemplateProps) => {
  const router = useRouter();
  const { data: student, isLoading } = useStudentDetails(studentId);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-62.5" />
            <Skeleton className="h-4 w-62.5" />
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex-1 p-8 text-center text-slate-500">
        Student not found.
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-slate-100 text-slate-700",
    SUSPENDED: "bg-red-100 text-red-700",
    ALUMNI: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(basePath)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold tracking-tight text-slate-800">
          Back to Students
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border rounded-xl shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200">
            <User className="h-8 w-8 text-slate-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {student.user?.firstName || "Unknown"}{" "}
              {student.user?.lastName || ""}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-600 font-medium"
              >
                {student.admissionNumber}
              </Badge>
              <Badge
                className={
                  statusColors[student.status] || "bg-slate-100 text-slate-700"
                }
              >
                {student.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 mt-6">
        <TabsList className="bg-slate-100 border border-slate-200">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="academic">Academic History</TabsTrigger>
          <TabsTrigger value="parents">Linked Parents</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileTab student={student} />
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <AcademicHistoryTab
            studentId={student.id}
            currentEnrollment={student.currentEnrollment}
          />
        </TabsContent>

        <TabsContent value="parents" className="space-y-4">
          <ParentsTab studentId={student.id} parents={student.parents || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
