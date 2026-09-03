"use client";

import Image from "next/image";
import { useGetProfile } from "../api/get-profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  User,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileTemplate() {
  const { data: profileResponse, isLoading, isError } = useGetProfile();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !profileResponse?.data) {
    return (
      <div className="flex flex-1 items-center justify-center h-[50vh] flex-col gap-4 text-center">
        <h3 className="text-xl font-bold text-destructive">
          Failed to load profile
        </h3>
        <p className="text-muted-foreground max-w-md">
          There was an error retrieving your profile information.
        </p>
      </div>
    );
  }

  const profile = profileResponse.data;
  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
    profile.email;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col flex-1 space-y-6   max-w-5xl mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Personal Profile</h2>
        <p className="text-muted-foreground mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="col-span-1 shadow-sm border-border h-fit">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 relative rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border-4 border-background shadow-sm mb-4">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground">{fullName}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-primary font-medium bg-primary/10 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" />
              {profile.role}
            </div>

            <div className="w-full mt-6 space-y-3">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="col-span-1 md:col-span-2 shadow-sm border-border">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Detailed information about your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  First Name
                </div>
                <p className="font-semibold text-foreground">
                  {profile.firstName || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Last Name
                </div>
                <p className="font-semibold text-foreground">
                  {profile.lastName || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <p className="font-semibold text-foreground">{profile.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Status
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${profile.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
                  >
                    {profile.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(profile.createdAt)}
                </p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last Login
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(profile.lastLoginAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
