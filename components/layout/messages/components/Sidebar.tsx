import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Conversation, Group } from "../types";
import ConversationList from "./ConversationList";
import UserList from "./UserList";

interface SidebarProps {
  showMobileMenu: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  conversations: Conversation[] | undefined;
  groups: Group[] | undefined;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  isLoadingConversations: boolean;
  isLoadingGroups: boolean;
  availableUsers: { _id: string; name: string; avatar: string; role: string }[] | undefined;
  isLoadingUsers: boolean;
  userRole?: string;
  onGroupCreated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ 
  showMobileMenu, 
  onClose, 
  activeTab, 
  setActiveTab,
  conversations,
  groups,
  selectedUserId,
  onSelectUser,
  isLoadingConversations,
  isLoadingGroups,
  availableUsers,
  isLoadingUsers,
  userRole,
  onGroupCreated
}) => {
  console.log("Sidebar - User Role:", userRole);
  return (
    <aside className={cn(
      "fixed inset-0 z-50 bg-white md:relative md:block md:col-span-1 border-r h-full",
      showMobileMenu ? "block" : "hidden"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4">
            <Input placeholder="Search messages" />
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-4 pt-2 flex-shrink-0">
              <TabsList className={`grid w-full ${userRole === "volunteer" ? "grid-cols-1" : "grid-cols-2"}`}>
                <TabsTrigger value="conversations">Conversations</TabsTrigger>
                {userRole !== "volunteer" && (
                  <TabsTrigger value="applicants">Volunteers</TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="conversations" className="mt-0 flex-1 min-h-0">
              <ConversationList 
                conversations={conversations}
                groups={groups}
                selectedUserId={selectedUserId}
                onSelectUser={onSelectUser}
                isLoading={isLoadingConversations}
                isLoadingGroups={isLoadingGroups}
                onCreateGroup={onGroupCreated}
                userRole={userRole}
              />
            </TabsContent>

            {userRole !== "volunteer" && (
              <TabsContent value="applicants" className="mt-0 flex-1 min-h-0">
                <UserList 
                  users={availableUsers}
                  onSelectUser={onSelectUser}
                  isLoading={isLoadingUsers}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar; 