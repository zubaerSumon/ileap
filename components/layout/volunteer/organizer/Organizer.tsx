import TopNavigationBar from "@/components/TopNavigationBar";
import CleanUpAustralia from "./CleanUpAustralia";
import EasyCareGardening from "./EasyCareGardening";

interface OrganizerProps {
  organizerId: string;
}

export default function Organizer({ organizerId }: OrganizerProps) {
  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <TopNavigationBar/>
      {/* Use organizerId to determine what content to display */}
      {organizerId === "clean-up-australia" && (
        <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
          <CleanUpAustralia />
        </div>
      )}

      {organizerId === "easy-care-gardening" && (
        <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
          <EasyCareGardening />
        </div>
      )}

      {!["clean-up-australia", "easy-care-gardening"].includes(organizerId) && (
        <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
          <h1 className="text-2xl font-bold">Organizer not found</h1>
        </div>
      )}
    </div>
  );
}