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
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredConversations = conversations?.filter(conv => 
    conv.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  const filteredGroups = groups?.filter(group =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  const filteredUsers = availableUsers?.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-39 w-full md:w-80 bg-white  md:relative md:translate-x-0 transition-transform duration-200 ease-in-out",
      showMobileMenu ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
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
                conversations={filteredConversations}
                groups={filteredGroups}
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
                  users={filteredUsers}
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