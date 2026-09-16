"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicYearsTab } from "./AcademicYearsTab";
import { ClassesTab } from "./ClassesTab";
import { SubjectsTab } from "./SubjectsTab";
import { useSearchParams } from "next/navigation";

export const AcademicsPageTemplate = () => {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "years";
  const [currentTab, setCurrentTab] = useState(tabFromUrl);
  const [prevTabFromUrl, setPrevTabFromUrl] = useState(tabFromUrl);

  // Sync state during render if URL changes externally (e.g., browser back button)
  // This is the recommended pattern in React to avoid useEffect cascading renders.
  if (tabFromUrl !== prevTabFromUrl) {
    setPrevTabFromUrl(tabFromUrl);
    setCurrentTab(tabFromUrl);
  }

  const handleTabChange = (val: string) => {
    setCurrentTab(val);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", val);
    // Use history API to update URL instantly without Next.js navigation cycle
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Academic Management
        </h2>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
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
