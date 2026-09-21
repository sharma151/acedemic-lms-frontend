import { TimetableConfigurationsTemplate } from "@/features/timetable/components/TimetableConfigurationsTemplate";

export const metadata = {
  title: "Timetable Configurations",
  description: "Manage timetable configurations and schedules",
};

export default function TimetableConfigurationsPage() {
  return (
    <div className="p-6">
      <TimetableConfigurationsTemplate />
    </div>
  );
}
