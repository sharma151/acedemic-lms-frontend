import { StudentDetailsPageTemplate } from "@/features/students";

export default async function SuperAdminStudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <StudentDetailsPageTemplate
      studentId={id}
      basePath="/super-admin/students"
    />
  );
}
