"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import DeleteGroupModal from './DeleteGroupModal';
import DeleteConversationModal from './DeleteConversationModal';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import { cn } from "@/lib/utils";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { Group } from "@/types/message";

interface MessageUIProps {
  initialUserId?: string | null;
}

export const MessageUI: React.FC<MessageUIProps> = ({ initialUserId }) => {
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConversationModal, setShowDeleteConversationModal] = useState(false);
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

  // Add tRPC subscription for real-time messaging
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isConnected: isSubscriptionConnected } = useMessageSubscription(selectedUserId, isGroup);

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

  const { data: availableUsersData, isLoading: isLoadingUsers } = trpc.users.getAvailableUsers.useQuery({
    page: 1,
    limit: 50,  
  }, {
    enabled: !!session && session.user?.role !== "volunteer"
  });

  const availableUsers = availableUsersData?.users || [];

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

  const deleteConversationMutation = trpc.messages.deleteConversation.useMutation({
    onSuccess: () => {
      toast.success("Conversation deleted successfully");
      setSelectedUserId(null);
      utils.messages.getConversations.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete conversation");
    },
  });

  const handleDeleteGroup = () => {
    if (selectedUserId) {
      deleteGroupMutation.mutate({ groupId: selectedUserId });
    }
  };

  const handleDeleteConversation = () => {
    setShowDeleteConversationModal(true);
  };

  const handleConfirmDeleteConversation = () => {
    if (selectedUserId) {
      deleteConversationMutation.mutate({ conversationId: selectedUserId });
    }
    setShowDeleteConversationModal(false);
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
                currentUserId={session?.user?.id || ""} 
                isSending={false} 
                selectedConversationId={null}
                onDeleteConversation={!isGroup && (session?.user?.role === "admin" || session?.user?.role === "mentor" || session?.user?.role === "organization") ? handleDeleteConversation : undefined}
              />
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

      {showDeleteConversationModal && selectedConversation && (
        <DeleteConversationModal
          userName={selectedConversation.user?.name || "Unknown User"}
          onClose={() => setShowDeleteConversationModal(false)}
          onDelete={handleConfirmDeleteConversation}
        />
      )}
    </div>
  );
};

export default MessageUI;

