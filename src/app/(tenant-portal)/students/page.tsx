import { StudentsPageTemplate } from "@/features/students";

export default function TenantStudentsPage() {
  return (
    <StudentsPageTemplate
      title="Students"
      description="Manage all students enrolled in the institution."
      basePath="/students"
    />
  );
}
