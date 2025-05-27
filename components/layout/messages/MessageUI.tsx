"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import type { Group } from "./types";
import { useMessages, useConversations } from "./hooks";
import DeleteGroupModal from './DeleteGroupModal';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';

export const MessageUI: React.FC = () => {
  const { data: session } = useSession();
  console.log("MessageUI - Full Session:", session);
  console.log("MessageUI - User Role:", session?.user?.role);
  console.log("MessageUI - User Email:", session?.user?.email);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const utils = trpc.useUtils();

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
    // Mark messages as read when conversation is opened
    if (!isGroup) {
      markAsReadMutation.mutate({ conversationId: userId });
    } else {
      // For groups, we'll use the getGroupMessages query which automatically marks messages as read
      utils.messages.getGroupMessages.invalidate({ groupId: userId });
    }
  };

  const handleGroupCreated = () => {
    utils.messages.getGroups.invalidate();
  };

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

  // Ensure we have the correct data before rendering
  const currentConversation = isGroup ? selectedGroup : selectedConversation;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-full bg-white rounded-lg border">
      <Sidebar
        showMobileMenu={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        conversations={conversations}
        groups={groups as Group[] | undefined}
        selectedUserId={selectedUserId}
        onSelectUser={handleSelectUser}
        isLoadingConversations={isLoadingConversations}
        isLoadingGroups={isLoadingGroups}
        availableUsers={availableUsers}
        isLoadingUsers={isLoadingUsers}
        userRole={session?.user?.role}
        onGroupCreated={handleGroupCreated}
      />

      <main className="col-span-1 md:col-span-3 flex flex-col h-full">
        {selectedUserId && currentConversation ? (
          <>
            <ChatArea
              messages={flattenedMessages}
              isLoadingMessages={isLoadingMessages}
              selectedConversation={currentConversation}
              onMenuClick={() => setShowMobileMenu(true)}
              session={session}
              isGroup={isGroup}
              onDeleteGroup={isGroup && session?.user?.role !== "volunteer" ? () => setShowDeleteModal(true) : undefined}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
            />
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </>
        ) : (
          <div className="md:flex-1 md:flex md:items-center md:justify-center md:text-gray-500 md:p-4">
            <div className="md:text-center md:mb-4">
              <p className="md:mb-2 hidden md:block">Select a conversation to start messaging</p>
              <div className="md:hidden">
                <Sidebar
                  showMobileMenu={true}
                  onClose={() => {}}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  conversations={conversations}
                  groups={groups as Group[] | undefined}
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
            </div>
          </div>
        )}
      </main>

      {showDeleteModal && selectedGroup && session?.user?.role !== "volunteer" && (
        <DeleteGroupModal
          groupName={(selectedGroup as Group).name}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteGroup}
        />
      )}
    </div>
  );
};

export default MessageUI;

