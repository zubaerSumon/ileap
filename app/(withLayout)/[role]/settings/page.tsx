"use client";

import { trpc } from "@/utils/trpc";
import { Loader2, Users, UserPlus, Settings } from "lucide-react";
import InviteMentorDialog from "@/components/layout/organisation/dashboard/InviteMentorDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function OrganizationSettingsPage() {
  const [activeSection, setActiveSection] = useState("users");
  const { data: profileData } = trpc.users.profileCheckup.useQuery();
  const { data: mentors, isLoading: isLoadingMentors } = trpc.mentors.getMentors.useQuery(
    { organizationId: profileData?.organizationProfile?._id || "" },
    { enabled: !!profileData?.organizationProfile?._id }
  );

  const menuItems = [
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "mentors", label: "Mentors", icon: UserPlus },
    { id: "general", label: "General Settings", icon: Settings },
  ];

  return (
    <ProtectedLayout>
      <div className="max-w-[1240px] mx-auto px-4 py-6 md:py-12">
        <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>
        
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10",
                      activeSection === item.id && "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeSection === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Manage Users
                  </CardTitle>
                  <CardDescription>
                    View and manage users in your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management features coming soon...</p>
                </CardContent>
              </Card>
            )}

            {activeSection === "mentors" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Manage Mentors
                      </CardTitle>
                      <CardDescription>
                        Invite and manage mentors for your organization
                      </CardDescription>
                    </div>
                    <InviteMentorDialog organizationId={profileData?.organizationProfile?._id || ""} />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingMentors ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : mentors && mentors.length > 0 ? (
                    <div className="space-y-4">
                      {mentors.map((mentor) => (
                        <div
                          key={mentor._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium">{mentor.mentor.name}</h3>
                            <p className="text-sm text-muted-foreground">{mentor.mentor.email}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Invited by: {mentor.invited_by.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No mentors have been invited yet
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage your organization&apos;s general settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">General settings features coming soon...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
} 