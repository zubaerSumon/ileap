import ProtectedLayout from "@/components/layout/ProtectedLayout";
import OrganizationProfile from "../../../../components/layout/organisation/OrganizationProfile";


export default function ProfilePage() {
  return (
    <ProtectedLayout>
      
        <OrganizationProfile/>
      
    </ProtectedLayout>
  );
}
