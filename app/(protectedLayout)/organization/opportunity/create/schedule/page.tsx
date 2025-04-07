import ScheduleRecurrence from "../components/ScheduleRecurrence";
import CreateFooter from "../components/CreateFooter";

export default function SchedulePage() {
  return (
    <>
      <ScheduleRecurrence />
      <CreateFooter step={2} />
    </>
  );
}