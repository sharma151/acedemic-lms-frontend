"use client";

import React, { useState } from "react";
import { SettingsFormData, settingsSchema } from "../schemas/settings";
import { useGetSettings, useUpdateSettings } from "../api/settings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  Globe,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Settings as SettingsIcon,
} from "lucide-react";

export const SettingsForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const onSubmit = (data: SettingsFormData) => {
    updateSettings(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Define fields metadata to avoid repetition
  const fieldsMeta = [
    {
      name: "timezone",
      label: "Timezone",
      icon: Globe,
      placeholder: "e.g. America/New_York",
      value: settings?.timezone,
    },
    {
      name: "currency",
      label: "Currency",
      icon: DollarSign,
      placeholder: "e.g. USD",
      value: settings?.currency,
    },
    {
      name: "academicSession",
      label: "Academic Session",
      icon: Calendar,
      placeholder: "e.g. 2025-2026",
      value: settings?.academicSession,
    },
    {
      name: "contactEmail",
      label: "Contact Email",
      icon: Mail,
      placeholder: "e.g. contact@school.edu",
      type: "email",
      value: settings?.contactEmail,
    },
    {
      name: "contactPhone",
      label: "Contact Phone",
      icon: Phone,
      placeholder: "e.g. +1-555-0123",
      value: settings?.contactPhone,
    },
    {
      name: "address",
      label: "Address",
      icon: MapPin,
      placeholder: "123 School St, City, State",
      value: settings?.address,
      colSpan: 2,
    },
  ];

  return (
    <Card className="w-full shadow-sm border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-border/40 px-6 sm:px-8 pt-6 sm:pt-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <SettingsIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
              Institution Settings
            </CardTitle>
            <CardDescription className="text-sm">
              Your general configuration and contact details.
            </CardDescription>
          </div>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className=" h-9 px-4 rounded-md font-medium"
          >
            Edit Settings
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6 sm:pt-8 px-6 sm:px-8 pb-8">
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
            {fieldsMeta.map((field) => (
              <div
                key={field.name}
                className={`flex flex-col gap-1 ${field.colSpan === 2 ? "md:col-span-2" : ""}`}
              >
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {field.label}
                </div>
                <div className="text-[15px] text-foreground flex items-center gap-2">
                  {field.name === "timezone" && (
                    <Globe className="h-4 w-4 text-primary/70" />
                  )}
                  {field.name === "currency" && (
                    <DollarSign className="h-4 w-4 text-primary/70" />
                  )}
                  {field.name === "academicSession" && (
                    <Calendar className="h-4 w-4 text-primary/70" />
                  )}
                  {field.name === "contactEmail" && (
                    <Mail className="h-4 w-4 text-primary/70" />
                  )}
                  {field.name === "contactPhone" && (
                    <Phone className="h-4 w-4 text-primary/70" />
                  )}
                  {field.name === "address" && (
                    <MapPin className="h-4 w-4 text-primary/70" />
                  )}

                  {field.value || (
                    <span className="text-muted-foreground/60 italic">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Form 
            schema={settingsSchema} 
            onSubmit={onSubmit}
            options={{
              defaultValues: {
                timezone: "",
                currency: "",
                academicSession: "",
                contactEmail: "",
                contactPhone: "",
                address: "",
              },
              values: settings || undefined,
            }}
          >
            {(form) => (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldsMeta.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof SettingsFormData}
                    render={({ field: formField }) => (
                      <FormItem
                        className={field.colSpan === 2 ? "md:col-span-2" : ""}
                      >
                        <FormLabel className="flex items-center gap-2">
                          <field.icon className="h-4 w-4 text-primary/70" />
                          {field.label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            {...formField}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset(settings);
                    setIsEditing(false);
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isDirty}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
            )}
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
