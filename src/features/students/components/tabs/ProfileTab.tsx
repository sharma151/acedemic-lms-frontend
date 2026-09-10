"use client";

import React, { useState } from "react";
import { Edit, Mail, Phone, MapPin, Droplets, Calendar, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "../../types";
import { StudentFormDialog } from "../StudentFormDialog";

interface ProfileTabProps {
  student: Student;
}

export const ProfileTab = ({ student }: ProfileTabProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsEditOpen(true)} variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
              <UserRound className="h-5 w-5 mr-2 text-slate-500" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Gender</p>
                <p className="font-medium text-slate-900">{student.gender || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date of Birth</p>
                <p className="font-medium text-slate-900 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                  {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Blood Group</p>
                <p className="font-medium text-slate-900 flex items-center">
                  <Droplets className="h-3 w-3 mr-1 text-red-400" />
                  {student.bloodGroup || "Unknown"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="font-medium text-slate-900 flex items-center">
                <Mail className="h-3 w-3 mr-2 text-slate-400" />
                {student.user?.email || "No email"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Emergency Contact</p>
              <p className="font-medium text-slate-900 flex items-center">
                <Phone className="h-3 w-3 mr-2 text-slate-400" />
                {student.emergencyContactPhone}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Address</p>
              <p className="font-medium text-slate-900 flex items-start">
                <MapPin className="h-4 w-4 mr-1 text-slate-400 shrink-0 mt-0.5" />
                {student.address}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <StudentFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        student={student}
      />
    </div>
  );
};
