"use client";
import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Message = {
  _id: string;
  content: string;
  createdAt: Date;
  sender: {
    _id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  receiver: {
    _id: string;
    name: string;
    avatar: string;
    role?: string;
  };
};

type Conversation = {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  lastMessage: {
    content: string;
  };
};

export const MessageUI: React.FC = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations");

  const utils = trpc.useUtils();
  const { data: conversations, isLoading: isLoadingConversations, error: conversationsError } = trpc.messages.getConversations.useQuery<Conversation[]>(undefined, {
    enabled: sessionStatus === "authenticated"
  });
  
  const { data: messages, isLoading: isLoadingMessages, error: messagesError } = trpc.messages.getMessages.useQuery<Message[]>(
    { userId: selectedUserId || "" },
    { enabled: !!selectedUserId && sessionStatus === "authenticated" }
  );

  const { data: availableUsers, isLoading: isLoadingUsers } = trpc.users.getAvailableUsers.useQuery(undefined, {
    enabled: sessionStatus === "authenticated"
  });

  // Get user role from session
  const userRole = session?.user?.role;

  // Debug logging
  console.log('MessageUI Debug:', {
    sessionStatus,
    userRole,
    availableUsers,
    isLoadingUsers
  });

  // Determine the label based on user role
  const secondTabLabel = userRole === 'volunteer' ? 'Organizations' : 'Volunteers';

  const sendMessageMutation = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      utils.messages.getMessages.invalidate({ userId: selectedUserId || "" });
      utils.messages.getConversations.invalidate();
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    sendMessageMutation.mutate({
      receiverId: selectedUserId,
      content: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="flex h-[800px] bg-white relative m-4 border rounded-lg overflow-hidden">
      {/* Left Sidebar */}
      <div
        className={`${
          showMobileMenu ? "fixed inset-0 z-50 bg-white" : "hidden"
        } md:relative md:block md:w-1/4 border-r flex flex-col`}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="sr-only">Close</span>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Input type="text" placeholder="Search messages" />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="applicants">{secondTabLabel}</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <TabsContent value="conversations" className="mt-0">
              {isLoadingConversations ? (
                <div className="p-4 text-center text-gray-500">Loading conversations...</div>
              ) : conversationsError ? (
                <div className="p-4 text-center text-red-500">Error loading conversations: {conversationsError.message}</div>
              ) : conversations?.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations found</div>
              ) : (
                conversations?.map((conversation) => (
                  <Card
                    key={conversation._id}
                    className={`mx-2 my-1 shadow-none border-0 hover:bg-gray-50 cursor-pointer ${
                      selectedUserId === conversation._id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedUserId(conversation._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={conversation.user.avatar || "/avatar.svg"}
                          alt={conversation.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{conversation.user.name}</h3>
                          <p className="text-xs text-gray-400">{conversation.user.role}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="applicants" className="mt-0">
              {isLoadingUsers ? (
                <div className="p-4 text-center text-gray-500">Loading {secondTabLabel.toLowerCase()}...</div>
              ) : availableUsers?.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No {secondTabLabel.toLowerCase()} found</div>
              ) : (
                availableUsers?.map((user) => (
                  <Card
                    key={user._id}
                    className="mx-2 my-1 shadow-none border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedUserId(user._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.avatar || "/avatar.svg"}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setShowMobileMenu(true)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                  {conversations?.find((c) => c._id === selectedUserId)?.user && (
                    <>
                      <Image
                        src={
                          conversations.find((c) => c._id === selectedUserId)
                            ?.user.avatar || "/avatar.svg"
                        }
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <h2 className="font-semibold">
                          {conversations.find((c) => c._id === selectedUserId)
                            ?.user.name}
                        </h2>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {isLoadingMessages ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messagesError ? (
                <div className="text-center text-red-500">Error loading messages: {messagesError.message}</div>
              ) : messages?.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet</div>
              ) : (
                <div className="space-y-4">
                  {messages?.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender._id === session?.user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${message.sender._id === session?.user?.id ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-lg p-3`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {format(new Date(message.createdAt), "p")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button className="h-9" type="submit" disabled={!newMessage.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageUI;

