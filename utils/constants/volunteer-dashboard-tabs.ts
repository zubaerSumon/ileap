import { BookOpen, FileText, GraduationCap } from "lucide-react";
export const VOLUNTEER_DASHBOARD_TABS = [
  {
    key: "applied",
    label: "Active opportunities",
    icon: BookOpen,
    emptyState: {
      title: "No active opportunities",
      description:
        "You haven't applied to any current or upcoming opportunities yet. Start exploring and applying to opportunities that interest you.",
    },
  },
  {
    key: "recent",
    label: "Recent opportunities",
    icon: FileText,
    emptyState: {
      title: "No recent opportunities",
      description:
        "You don't have any opportunities that have already started. Your past opportunities will appear here.",
    },
  },
  {
    key: "mentor",
    label: "Mentor assignments",
    icon: GraduationCap,
    emptyState: {
      title: "No mentor assignments",
      description:
        "You haven't been assigned as a mentor for any opportunities yet. Organizations will assign you when they need mentorship support.",
    },
  },
] as const;

export type VolunteerDashboardTabKey =
  (typeof VOLUNTEER_DASHBOARD_TABS)[number]["key"];
