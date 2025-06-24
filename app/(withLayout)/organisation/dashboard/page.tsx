import OrganisationDashboard from "@/components/layout/organisation/dashboard";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function OrganizationDashboardPage() {
  return (
    <ProtectedLayout>
      <OrganisationDashboard />
    </ProtectedLayout>
  );
}
