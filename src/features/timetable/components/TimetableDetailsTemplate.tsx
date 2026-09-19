"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetConfiguration, useUpdateConfiguration } from "../api/timetable";
import { TimetableConfigurationStatus } from "../types";
import { WorkingDaysTab } from "./WorkingDaysTab";
import { PeriodsTab } from "./PeriodsTab";
import { ScheduleMatrixTab } from "./ScheduleMatrixTab";

export const TimetableDetailsTemplate = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: configuration, isLoading } = useGetConfiguration(id);
  const updateMutation = useUpdateConfiguration(id);

  const [activeTab, setActiveTab] = useState("matrix");

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!configuration) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-800">Configuration Not Found</h2>
          <Button variant="link" onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (status: TimetableConfigurationStatus) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleDefaultToggle = (isDefault: boolean) => {
    updateMutation.mutate({ id, data: { isDefault } });
  };

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 hover:bg-transparent h-auto">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Configurations
        </Button>
      </div>

      {/* Top Summary Bar */}
      <div className="bg-white border rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900">{configuration.name}</h1>
            {configuration.isDefault && (
              <Badge className="bg-teal-50 text-teal-700 border-teal-200" variant="outline">
                <Star className="w-3 h-3 mr-1 fill-teal-500" /> Default
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-6 text-sm text-slate-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              Academic Year: <span className="font-medium ml-1 text-slate-900">{configuration.academicYear?.name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-slate-400" />
              {configuration.totalDays || 0} Days, {configuration.totalPeriods || 0} Periods
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="flex flex-col items-end space-y-1">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Set as Default</span>
            <Switch
              checked={configuration.isDefault}
              onCheckedChange={handleDefaultToggle}
              disabled={updateMutation.isPending}
            />
          </div>
          
          <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
          
          <div className="flex flex-col space-y-1 w-[140px]">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Status</span>
            <Select
              value={configuration.status}
              onValueChange={(val) => handleStatusChange(val as TimetableConfigurationStatus)}
              disabled={updateMutation.isPending}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-100 p-1">
          <TabsTrigger value="matrix" className="text-sm">Schedule Matrix</TabsTrigger>
          <TabsTrigger value="days" className="text-sm">Working Days</TabsTrigger>
          <TabsTrigger value="periods" className="text-sm">Periods & Breaks</TabsTrigger>
        </TabsList>

        <div className="bg-white border border-t-0 rounded-b-lg p-6 shadow-sm min-h-[400px]">
          <TabsContent value="matrix" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <ScheduleMatrixTab configurationId={id} />
          </TabsContent>
          <TabsContent value="days" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <WorkingDaysTab configurationId={id} />
          </TabsContent>
          <TabsContent value="periods" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <PeriodsTab configurationId={id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
