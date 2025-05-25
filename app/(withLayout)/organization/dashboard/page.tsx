import OrganisationDashboard from "@/components/layout/organisation/dashboard/OrganisationDashboard";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function OrganizationDashboardPage() {
  return (
    <ProtectedLayout>
      <OrganisationDashboard />
    </ProtectedLayout>
  );
}
