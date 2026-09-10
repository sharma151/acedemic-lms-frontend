import { StudentDetailsPageTemplate } from "@/features/students/components/StudentDetailsPageTemplate";

export default async function TenantStudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <StudentDetailsPageTemplate
      studentId={id}
      basePath="/students"
    />
  );
}
