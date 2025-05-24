"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
  _id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
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
    name: string;
    avatar: string;
    role: string;
  };
  lastMessage: {
    content: string;
    isRead: boolean;
  };
  unreadCount: number;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const Avatar = ({ name, avatar, size = 40 }: { name: string; avatar?: string; size?: number }) => {
  const initials = getInitials(name);
  const bgColor = getRandomColor(name);

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden",
      "ring-2 ring-offset-2 ring-offset-white",
      "flex items-center justify-center",
      "font-medium text-white",
      bgColor,
      size === 40 ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs"
    )}>
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

// Separate components for better organization
const ConversationHeader = ({ user, onMenuClick }: { user: { name: string; avatar: string }; onMenuClick: () => void }) => (
  <header className="p-4 border-b flex-shrink-0">
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Avatar name={user.name} avatar={user.avatar} />
      <div>
        <h2 className="font-semibold">{user.name}</h2>
      </div>
    </div>
  </header>
);

const MessageBubble = ({ message, isOwnMessage }: { message: Message; isOwnMessage: boolean }) => (
  <div
    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
  >
    {!isOwnMessage && (
      <Avatar name={message.sender.name} avatar={message.sender.avatar} size={32} />
    )}
    <div
      className={cn(
        "max-w-[70%] rounded-lg p-3 ml-2",
        isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100"
      )}
    >
      <p className="break-words">{message.content}</p>
      <p className="text-xs mt-1 opacity-70">
        {format(new Date(message.createdAt), "p")}
      </p>
    </div>
    {isOwnMessage && (
      <Avatar name={message.sender.name} avatar={message.sender.avatar} size={32} />
    )}
  </div>
);

const MessageInput = React.memo(({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  isSending 
}: { 
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isSending: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSendMessage} className="w-full">
      <div className="flex items-center h-16 px-4 py-4 border-t">
        <div className="flex-1 flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="h-10 flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isSending}
            className="h-10"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
});

MessageInput.displayName = 'MessageInput';

const ChatArea = React.memo(({ 
  messages, 
  isLoadingMessages,
  selectedConversation,
  onMenuClick,
  session
}: { 
  messages: Message[] | undefined;
  isLoadingMessages: boolean;
  selectedConversation: Conversation | undefined;
  onMenuClick: () => void;
  session: { user?: { id?: string } } | null;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  return (
    <div className="flex flex-col h-full">
      {selectedConversation && (
        <ConversationHeader 
          user={selectedConversation.user} 
          onMenuClick={onMenuClick}
        />
      )}

      <div className="flex-1 min-h-[400px] max-h-[calc(100vh-16rem)]">
        <ScrollArea className="h-full">
          <div className="p-4">
            {isLoadingMessages ? (
              <div className="text-center text-gray-500">Loading messages...</div>
            ) : messages?.length === 0 ? (
              <div className="text-center text-gray-500">No messages yet</div>
            ) : (
              <div className="space-y-4">
                {messages?.map((message: Message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isOwnMessage={message.sender._id === session?.user?.id}
                  />
                ))}
                <div ref={messagesEndRef} data-messages-end /> {/* Invisible element at the bottom */}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

ChatArea.displayName = 'ChatArea';

const ConversationList = React.memo(({ 
  conversations, 
  selectedUserId, 
  onSelectUser, 
  isLoading 
}: { 
  conversations: Conversation[] | undefined;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  isLoading: boolean;
}) => (
  <ScrollArea className="h-[calc(100vh-16rem)]">
    <div className="pr-4">
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : conversations?.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No conversations</div>
      ) : (
        <div className="divide-y">
          {conversations?.map((conversation: Conversation) => (
            <button
              key={conversation._id}
              onClick={() => onSelectUser(conversation._id)}
              className={cn(
                "w-full p-4 hover:bg-gray-50 transition-colors",
                selectedUserId === conversation._id && "bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar name={conversation.user.name} avatar={conversation.user.avatar} size={32} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{conversation.user.name}</h3>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{conversation.user.role}</p>
                  <p className={cn(
                    "text-sm truncate",
                    conversation.lastMessage.isRead ? "text-gray-500" : "text-gray-900 font-medium"
                  )}>
                    {conversation.lastMessage.content}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  </ScrollArea>
));

ConversationList.displayName = 'ConversationList';

const UserList = React.memo(({ 
  users, 
  onSelectUser, 
  isLoading 
}: { 
  users: { _id: string; name: string; avatar: string; role: string }[] | undefined;
  onSelectUser: (userId: string) => void;
  isLoading: boolean;
}) => (
  <ScrollArea className="h-[calc(100vh-16rem)]">
    <div className="pr-4">
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : users?.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No users found</div>
      ) : (
        <div className="divide-y">
          {users?.map((user) => (
            <button
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              className="w-full p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar name={user.name} avatar={user.avatar} />
                <div className="min-w-0 text-left">
                  <h3 className="font-medium truncate">{user.name}</h3>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  </ScrollArea>
));

UserList.displayName = 'UserList';

const Sidebar = React.memo(({ 
  showMobileMenu, 
  onClose, 
  activeTab, 
  setActiveTab,
  conversations,
  selectedUserId,
  onSelectUser,
  isLoadingConversations,
  availableUsers,
  isLoadingUsers,
  userRole
}: {
  showMobileMenu: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  conversations: Conversation[] | undefined;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  isLoadingConversations: boolean;
  availableUsers: { _id: string; name: string; avatar: string; role: string }[] | undefined;
  isLoadingUsers: boolean;
  userRole?: string;
}) => (
  <aside className={`${showMobileMenu ? 'fixed inset-0 z-50 bg-white' : 'hidden'} md:block md:col-span-1 border-r h-full`}>
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
              selectedUserId={selectedUserId}
              onSelectUser={onSelectUser}
              isLoading={isLoadingConversations}
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
));

Sidebar.displayName = 'Sidebar';

export const MessageUI: React.FC = () => {
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations");
  const utils = trpc.useUtils();

  // Queries
  const { data: conversations, isLoading: isLoadingConversations } = trpc.messages.getConversations.useQuery(undefined, {
    enabled: !!session,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if we have cached data
  });

  const { data: messages, isLoading: isLoadingMessages } = trpc.messages.getMessages.useQuery(
    { userId: selectedUserId || "" },
    { enabled: !!selectedUserId && !!session }
  );

  const { data: availableUsers, isLoading: isLoadingUsers } = trpc.users.getAvailableUsers.useQuery(undefined, {
    enabled: !!session && session.user?.role !== "volunteer"
  });

  // Mutations
  const sendMessageMutation = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      utils.messages.getMessages.invalidate({ userId: selectedUserId || "" });
      utils.messages.getConversations.invalidate();
      // Scroll to bottom after sending message
      setTimeout(() => {
        const messagesEnd = document.querySelector('[data-messages-end]');
        messagesEnd?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    }
  });

  const markMessagesAsReadMutation = trpc.messages.markAsRead.useMutation({
    onSuccess: (data) => {
      if (data.updatedCount > 0) {
        utils.messages.getMessages.invalidate({ userId: selectedUserId || "" });
        utils.messages.getConversations.invalidate();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark messages as read");
    }
  });

  // Handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    sendMessageMutation.mutate({
      receiverId: selectedUserId,
      content: newMessage,
    });

    setNewMessage("");
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowMobileMenu(false);
  };

  // Effects
  useEffect(() => {
    if (messages?.length && session?.user?.id && selectedUserId) {
      const recentMessages = messages.slice(-20);
      const hasUnreadMessages = recentMessages.some(
        (msg: Message) => !msg.isRead && msg.receiver._id === session.user.id
      );
      
      if (hasUnreadMessages) {
        const timeoutId = setTimeout(() => {
          markMessagesAsReadMutation.mutate({ conversationId: selectedUserId });
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [messages, session?.user?.id, selectedUserId, markMessagesAsReadMutation]);

  const selectedConversation = conversations?.find((c) => c._id === selectedUserId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-full bg-white rounded-lg border">
      <Sidebar
        showMobileMenu={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        conversations={conversations}
        selectedUserId={selectedUserId}
        onSelectUser={handleSelectUser}
        isLoadingConversations={isLoadingConversations}
        availableUsers={availableUsers}
        isLoadingUsers={isLoadingUsers}
        userRole={session?.user?.role}
      />

      <main className="col-span-1 md:col-span-3 flex flex-col h-full">
        {selectedUserId ? (
          <>
            <ChatArea
              messages={messages}
              isLoadingMessages={isLoadingMessages}
              selectedConversation={selectedConversation}
              onMenuClick={() => setShowMobileMenu(true)}
              session={session}
            />
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              isSending={sendMessageMutation.isPending}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </main>
    </div>
  );
};

export default MessageUI;

