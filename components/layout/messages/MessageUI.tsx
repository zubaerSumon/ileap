"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import type { Group } from "./types";
import { useMessages, useConversations } from "./hooks";
import DeleteGroupModal from './DeleteGroupModal';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import { cn } from "@/lib/utils";

interface MessageUIProps {
  initialUserId?: string | null;
}

export const MessageUI: React.FC<MessageUIProps> = ({ initialUserId }) => {
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const utils = trpc.useUtils();

  useEffect(() => {
    if (initialUserId) {
      setSelectedUserId(initialUserId);
      setActiveTab("applicants");
    }
  }, [initialUserId]);

  const { conversations, groups, isLoadingConversations, isLoadingGroups, markAsReadMutation } = useConversations();
  
  const selectedConversation = conversations?.find((c) => c._id === selectedUserId);
  const selectedGroup = (groups as Group[] | undefined)?.find((g) => g._id === selectedUserId);
  const isGroup = selectedGroup !== undefined;

  const { 
    newMessage, 
    setNewMessage, 
    handleSendMessage, 
    handleLoadMore,
    flattenedMessages,
    isLoadingMessages,
    hasMore,
    isLoadingMore,
    isSending
  } = useMessages(selectedUserId, isGroup);

  const { data: availableUsers, isLoading: isLoadingUsers } = trpc.users.getAvailableUsers.useQuery(undefined, {
    enabled: !!session && session.user?.role !== "volunteer"
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowMobileMenu(false);
    if (!isGroup) {
      markAsReadMutation.mutate({ conversationId: userId });
    } else {
      utils.messages.getGroupMessages.invalidate({ groupId: userId });
    }
  };

  const handleGroupCreated = () => {
    utils.messages.getGroups.invalidate();
  };

  // Add effect to handle group selection
  useEffect(() => {
    if (selectedUserId && isGroup) {
      utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId });
    }
  }, [selectedUserId, isGroup, utils.messages.getGroupMessages]);

  const deleteGroupMutation = trpc.messages.deleteGroup.useMutation({
    onSuccess: () => {
      toast.success("Group deleted successfully");
      setSelectedUserId(null);
      setShowDeleteModal(false);
      utils.messages.getGroups.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete group");
    },
  });

  const handleDeleteGroup = () => {
    if (selectedUserId) {
      deleteGroupMutation.mutate({ groupId: selectedUserId });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-full overflow-hidden">
      <div className={cn(
        "col-span-1 border-r bg-white overflow-hidden",
        showMobileMenu ? "block" : "hidden md:block"
      )}>
        <Sidebar
          showMobileMenu={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          conversations={conversations}
          groups={groups}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
          isLoadingConversations={isLoadingConversations}
          isLoadingGroups={isLoadingGroups}
          availableUsers={availableUsers}
          isLoadingUsers={isLoadingUsers}
          userRole={session?.user?.role}
          onGroupCreated={handleGroupCreated}
        />
      </div>

      <main className="col-span-1 md:col-span-3 flex flex-col h-full border-l">
        {selectedUserId ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0 relative">
              <ChatArea
                messages={flattenedMessages}
                isLoadingMessages={isLoadingMessages}
                selectedConversation={isGroup ? selectedGroup : selectedConversation || { _id: selectedUserId, user: { name: "New Conversation", avatar: "" } }}
                onMenuClick={() => setShowMobileMenu(true)}
                session={session}
                isGroup={isGroup}
                onDeleteGroup={isGroup && session?.user?.role !== "volunteer" ? () => setShowDeleteModal(true) : undefined}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                currentUserId={session?.user?.id || ""} isSending={false} selectedConversationId={null}              />
            </div>
            <div className="flex-shrink-0 border-t bg-white sticky bottom-0 p-4">
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                isSending={isSending}
              />
            </div>
          </div>
        ) : (
          <div className="md:flex-1 md:flex md:items-center md:justify-center md:text-gray-500 md:p-4">
            Select a conversation to start messaging
          </div>
        )}
      </main>

      {showDeleteModal && selectedGroup && (
        <DeleteGroupModal
          groupName={selectedGroup.name}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteGroup}
        />
      )}
    </div>
  );
};

export default MessageUI;

