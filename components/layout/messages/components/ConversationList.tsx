import React from "react";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Avatar from "./Avatar";
import CreateGroupDialog from "./CreateGroupDialog";
import { Group, Conversation } from "@/types/message";

interface ConversationListProps {
  conversations: Conversation[] | undefined;
  groups: Group[] | undefined;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  isLoading: boolean;
  isLoadingGroups: boolean;
  onCreateGroup: () => void;
  userRole?: string;
}

export const ConversationList: React.FC<ConversationListProps> = React.memo(
  ({
    conversations,
    groups,
    selectedUserId,
    onSelectUser,
    isLoading,
    isLoadingGroups,
    onCreateGroup,
    userRole,
  }) => {
    console.log("ConversationList - Conversations:", conversations);

    console.log("ConversationList - User Role:", userRole);
    // Sort conversations by last message time
    const sortedConversations = conversations?.sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || 0).getTime();
      const timeB = new Date(b.lastMessage?.createdAt || 0).getTime();
      return timeB - timeA;
    });

    // Sort groups by creation date first, then by last message time
    const sortedGroups = groups?.sort((a, b) => {
      // First sort by creation date (newest first)
      const creationTimeA = new Date(a.createdAt || 0).getTime();
      const creationTimeB = new Date(b.createdAt || 0).getTime();
      if (creationTimeA !== creationTimeB) {
        return creationTimeB - creationTimeA;
      }
      // If creation dates are equal, sort by last message time
      const messageTimeA = new Date(a.lastMessage?.createdAt || 0).getTime();
      const messageTimeB = new Date(b.lastMessage?.createdAt || 0).getTime();
      return messageTimeB - messageTimeA;
    });

    return (
      <div className="flex flex-col h-full">
        {/* Groups Section Header - Always visible for non-volunteers */}
        {userRole !== "volunteer" && (
          <div className="flex-shrink-0 p-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Groups</h3>
            <CreateGroupDialog
              onGroupCreated={onCreateGroup}
              userRole={userRole}
            />
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="pr-4">
            {isLoading || isLoadingGroups ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : !sortedConversations?.length && !sortedGroups?.length ? (
              <div className="p-4 text-center text-gray-500">
                No conversations
              </div>
            ) : (
              <div className="divide-y">
                {/* Groups List */}
                {sortedGroups && sortedGroups.length > 0 && (
                  <>
                    {sortedGroups.map((group) => (
                      <button
                        key={group._id}
                        onClick={() => onSelectUser(group._id)}
                        className={cn(
                          "w-full p-4 hover:bg-gray-50 transition-colors",
                          selectedUserId === group._id && "bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium truncate max-w-[150px]">
                                {group.name.length > 15 ? `${group.name.substring(0, 15)}...` : group.name}
                              </h3>
                              {group.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                                  {group.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-400">
                                {group.members.length} members
                              </p>
                              {group.lastMessage && (
                                <p className="text-xs text-gray-500">
                                  {format(
                                    new Date(group.lastMessage.createdAt),
                                    "MMM d, h:mm a"
                                  )}
                                </p>
                              )}
                            </div>
                            {group.lastMessage && (
                              <p
                                className={cn(
                                  "text-sm truncate mt-1",
                                  group.lastMessage.isRead
                                    ? "text-gray-500"
                                    : "text-gray-900 font-medium"
                                )}
                              >
                                {group.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {/* Individual Conversations Section */}
                {sortedConversations && sortedConversations.length > 0 && (
                  <>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Direct Messages
                      </h3>
                    </div>
                    {sortedConversations.map((conversation) => (
                      <button
                        key={conversation._id}
                        onClick={() => onSelectUser(conversation._id)}
                        className={cn(
                          "w-full p-4 hover:bg-gray-50 transition-colors",
                          selectedUserId === conversation._id && "bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={conversation.user.name}
                            avatar={conversation.user.avatar}
                            size={32}
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium truncate">
                                {conversation.user.name}
                              </h3>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-400">
                                {conversation.user.organization_profile?.title || conversation.user.role}
                              </p>
                              {conversation.lastMessage && (
                                <p className="text-xs text-gray-500">
                                  {format(
                                    new Date(
                                      conversation.lastMessage.createdAt
                                    ),
                                    "MMM d, h:mm a"
                                  )}
                                </p>
                              )}
                            </div>
                            {conversation.lastMessage && (
                              <p
                                className={cn(
                                  "text-sm truncate mt-1",
                                  conversation.lastMessage.isRead
                                    ? "text-gray-500"
                                    : "text-gray-900 font-medium"
                                )}
                              >
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

ConversationList.displayName = "ConversationList";

export default ConversationList;
