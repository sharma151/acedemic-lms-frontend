"use client";

import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createStudentSchema, updateStudentSchema } from "../schemas/students";
import { Student } from "../types";
import { useCreateStudent, useUpdateStudent } from "../api/students";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null; // null if creating
  academicYears?: { id: string; name: string; status: string }[];
  classes?: { id: string; name: string; section?: string | null }[];
}

export const StudentFormDialog = ({
  open,
  onOpenChange,
  student,
  academicYears = [],
  classes = [],
}: StudentFormDialogProps) => {
  const isEditing = !!student;

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Filter available years for enrollment (only show active/upcoming)
  const availableYears = academicYears.filter((y) => y.status !== "COMPLETED");

  const defaultValues = isEditing
    ? {
        firstName: student!.user?.firstName || "",
        lastName: student!.user?.lastName || "",
        dateOfBirth: student!.dateOfBirth
          ? new Date(student!.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: student!.gender || "MALE",
        bloodGroup: student!.bloodGroup || undefined,
        address: student!.address || "",
        emergencyContactPhone: student!.emergencyContactPhone || "",
        status: student!.status || "ACTIVE",
      }
    : {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        admissionNumber: "",
        dateOfBirth: "",
        gender: "MALE" as const,
        bloodGroup: undefined,
        address: "",
        emergencyContactPhone: "",
        currentEnrollment: {
          academicYearId: "",
          classId: "",
          rollNumber: "" as unknown as number,
        },
      };

  const onSubmit = (data:any) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: student!.id, data },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {isEditing ? "Edit Student Profile" : "Register New Student"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update student details."
              : "Fill in the details to register a new student."}
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={isEditing ? updateStudentSchema : createStudentSchema}
          onSubmit={onSubmit}
          options={{ defaultValues, values: defaultValues }}
        >
          {(form) => (
            <div className="space-y-4">
              <div className="overflow-y-auto max-h-[60vh] px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  {/* Personal Information */}
                  <div className="md:col-span-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded">
                    Personal Information
                  </div>

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "A+",
                              "A-",
                              "B+",
                              "B-",
                              "AB+",
                              "AB-",
                              "O+",
                              "O-",
                            ].map((bg) => (
                              <SelectItem key={bg} value={bg}>
                                {bg}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!isEditing && (
                    <FormField
                      control={form.control}
                      name="admissionNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admission Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Contact Information */}
                  <div className="md:col-span-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded mt-2">
                    Contact & Account
                  </div>

                  {!isEditing && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {!isEditing && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Academic Enrollment (Only on Create) */}
                  {!isEditing && (
                    <>
                      <div className="md:col-span-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded mt-2">
                        Current Academic Enrollment
                      </div>

                      <FormField
                        control={form.control}
                        name="currentEnrollment.academicYearId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Year</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableYears.map((y) => (
                                  <SelectItem key={y.id} value={y.id}>
                                    {y.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentEnrollment.classId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class & Section</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {classes.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.name} {c.section ? `(${c.section})` : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentEnrollment.rollNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roll Number</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {isEditing && (
                    <>
                      <div className="md:col-span-2 text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded mt-2">
                        Status Management
                      </div>
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">
                                  Inactive
                                </SelectItem>
                                <SelectItem value="SUSPENDED">
                                  Suspended
                                </SelectItem>
                                <SelectItem value="ALUMNI">Alumni</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="p-6 pt-4 flex justify-end space-x-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Save Changes" : "Register Student"}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
