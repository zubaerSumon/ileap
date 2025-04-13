import { EditVolunteerProfile } from "./components/EditVolunteerProfile";

export default function ProfilePage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <div className="bg-white rounded-lg max-w-[1100px] mx-auto py-10">
        <EditVolunteerProfile />
      </div>
    </div>
  );
}