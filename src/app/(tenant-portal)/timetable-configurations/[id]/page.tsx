import { TimetableDetailsTemplate } from "@/features/timetable";

export const metadata = {
  title: "Configure Timetable",
  description: "Configure timetable days, periods, and view schedule matrix",
};

export default function TimetableConfigurationDetailsPage() {
  return (
    <div className="p-6">
      <TimetableDetailsTemplate />
    </div>
  );
}
