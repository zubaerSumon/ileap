import React from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Conversation, Group } from "@/types/message";
import ConversationList from "./ConversationList";
import UserList from "./UserList";

interface SidebarProps {
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
    <aside className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 h-9 text-sm"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col overflow-hidden">
          {userRole !== "volunteer" && (
            <div className="flex-shrink-0 px-4 pt-3 pb-2">
              <TabsList className="grid w-full grid-cols-2 h-9">
                <TabsTrigger value="conversations" className="text-sm">Conversations</TabsTrigger>
                <TabsTrigger value="applicants" className="text-sm">Volunteers</TabsTrigger>
              </TabsList>
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-hidden">
            <TabsContent value="conversations" className="mt-0 h-full overflow-hidden">
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
              <TabsContent value="applicants" className="mt-0 h-full overflow-hidden">
                <UserList 
                  users={filteredUsers}
                  onSelectUser={onSelectUser}
                  isLoading={isLoadingUsers}
                />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;