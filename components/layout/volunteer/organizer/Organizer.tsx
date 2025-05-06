import CleanUpAustralia from "./CleanUpAustralia";
import EasyCareGardening from "./EasyCareGardening";

interface OrganizerProps {
  organizerId: string;
}

export default function Organizer({ organizerId }: OrganizerProps) {
  return (
    <div className="">
      {organizerId === "clean-up-australia" && (
        <div className=" px-4 mb-8 pt-20">
          <CleanUpAustralia />
        </div>
      )}

      {organizerId === "easy-care-gardening" && (
        <div className=" px-4 mb-8 pt-20">
          <EasyCareGardening />
        </div>
      )}

      {!["clean-up-australia", "easy-care-gardening"].includes(organizerId) && (
        <div className="px-4 mb-8 pt-20">
          <h1 className="text-2xl font-bold">Organizer not found</h1>
        </div>
      )}
    </div>
  );
}
