import { StudentsPageTemplate } from "@/features/students/components/StudentsPageTemplate";

export default function SuperAdminStudentsPage() {
  return (
    <StudentsPageTemplate
      title="Students"
      description="Manage all students registered in the system."
      basePath="/super-admin/students"
    />
  );
}
