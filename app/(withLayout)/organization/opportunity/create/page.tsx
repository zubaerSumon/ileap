import BasicInformation from "./components/BasicInformation";
import CreateFooter from "./components/CreateFooter";

export default function CreateOpportunityPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <BasicInformation />
      <CreateFooter step={1} />
    </div>
  );
}
