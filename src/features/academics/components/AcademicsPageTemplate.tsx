"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicYearsTab } from "./AcademicYearsTab";
import { ClassesTab } from "./ClassesTab";
import { SubjectsTab } from "./SubjectsTab";
import { useQueryParam } from "@/hooks/use-query-params";

export const AcademicsPageTemplate = () => {
  const { value: activeTab, setValue: setActiveTab } = useQueryParam("tab");
  const currentTab = activeTab || "years";

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Academic Management
        </h2>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={(val) => setActiveTab(val)}
        className="space-y-4"
      >
        <TabsList className="bg-slate-100 border border-slate-200">
          <TabsTrigger value="years">Academic Years</TabsTrigger>
          <TabsTrigger value="classes">Classes &amp; Sections</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>
        <TabsContent value="years" className="space-y-4">
          <AcademicYearsTab />
        </TabsContent>
        <TabsContent value="classes" className="space-y-4">
          <ClassesTab />
        </TabsContent>
        <TabsContent value="subjects" className="space-y-4">
          <SubjectsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
