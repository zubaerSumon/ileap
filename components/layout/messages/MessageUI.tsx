"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Plus, Users, Search } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
  receiver?: {
    _id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  group?: {
    _id: string;
    name: string;
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
    createdAt: string;
  };
  unreadCount: number;
};

type Group = {
  _id: string;
  name: string;
  description?: string;
  members: Array<{
    _id: string;
    name: string;
    avatar: string;
    role: string;
  }>;
  admins: Array<{
    _id: string;
    name: string;
    avatar: string;
    role: string;
  }>;
  lastMessage?: {
    content: string;
    isRead: boolean;
    createdAt: string;
  } | null;
  unreadCount: number;
  __v?: number;
  createdBy?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
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

const ConversationHeader = ({ 
  user, 
  onMenuClick,
  isGroup,
  onDeleteGroup
}: { 
  user: { name: string; avatar?: string; members?: number }; 
  onMenuClick: () => void;
  isGroup?: boolean;
  onDeleteGroup?: () => void;
}) => (
  <header className="p-4 border-b flex-shrink-0">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>
        {isGroup ? (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
        ) : (
          <Avatar name={user.name} avatar={user.avatar} />
        )}
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          {isGroup && user.members && (
            <p className="text-xs text-gray-500">{user.members} members</p>
          )}
        </div>
      </div>
      {isGroup && onDeleteGroup && (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onDeleteGroup}
        >
          Delete Group
        </Button>
      )}
    </div>
  </header>
);

const MessageBubble = ({ message, isOwnMessage }: { message: Message; isOwnMessage: boolean }) => (
  <div
    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
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
      <p className={cn(
        "text-xs mt-1",
        isOwnMessage ? "text-blue-100" : "text-gray-500"
      )}>
        {format(new Date(message.createdAt), "MMM d, h:mm a")}
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
  session,
  isGroup,
  onDeleteGroup,
  onLoadMore,
  hasMore,
  isLoadingMore
}: { 
  messages: Message[] | undefined;
  isLoadingMessages: boolean;
  selectedConversation: Conversation | Group | undefined;
  onMenuClick: () => void;
  session: { user?: { id?: string } } | null;
  isGroup?: boolean;
  onDeleteGroup?: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!topRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(topRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  const headerData = isGroup && selectedConversation ? {
    name: (selectedConversation as Group).name,
    members: (selectedConversation as Group).members?.length
  } : selectedConversation && 'user' in selectedConversation ? selectedConversation.user : undefined;

  return (
    <div className="flex flex-col h-full">
      {selectedConversation && headerData && (
        <ConversationHeader 
          user={headerData}
          onMenuClick={onMenuClick}
          isGroup={isGroup}
          onDeleteGroup={onDeleteGroup}
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
                {hasMore && (
                  <div ref={topRef} className="text-center">
                    {isLoadingMore ? (
                      <div className="text-gray-500">Loading more messages...</div>
                    ) : (
                      <button 
                        onClick={onLoadMore}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Load more messages
                      </button>
                    )}
                  </div>
                )}
                {messages?.map((message: Message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isOwnMessage={message.sender._id === session?.user?.id}
                  />
                ))}
                <div ref={messagesEndRef} data-messages-end />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

ChatArea.displayName = 'ChatArea';

const CreateGroupDialog = ({ onGroupCreated }: { onGroupCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { data: availableUsers } = trpc.users.getAvailableUsers.useQuery(undefined, {
    enabled: open,
  });

  const filteredUsers = availableUsers?.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUsersList = availableUsers?.filter(user =>
    selectedUsers.includes(user._id)
  ) || [];

  const createGroupMutation = trpc.messages.createGroup.useMutation({
    onSuccess: () => {
      setOpen(false);
      setName("");
      setSearchQuery("");
      setSelectedUsers([]);
      onGroupCreated();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create group");
    },
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedUsers.length === 0) return;

    createGroupMutation.mutate({
      name,
      memberIds: selectedUsers,
    });
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(id => id !== userId));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateGroup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your group"
              required
              className="h-10"
            />
          </div>

          {selectedUsersList.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Members ({selectedUsersList.length})</Label>
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-gray-50/50">
                {selectedUsersList.map((user) => (
                  <div 
                    key={`selected-${user._id}`} 
                    className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm border"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar name={user.name} avatar={user.avatar} size={24} />
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUser(user._id)}
                      className="p-1 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Add Members</Label>
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members to add..."
                className="h-10 pl-9"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2 border rounded-lg divide-y max-h-[250px] overflow-y-auto">
              {filteredUsers?.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No users found
                </div>
              ) : (
                filteredUsers?.map((user) => (
                  <div 
                    key={user._id} 
                    className={cn(
                      "flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors",
                      selectedUsers.includes(user._id) && "bg-blue-50"
                    )}
                  >
                    <input
                      type="checkbox"
                      id={user._id}
                      checked={selectedUsers.includes(user._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user._id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={user._id} className="flex items-center space-x-3 cursor-pointer flex-1">
                      <Avatar name={user.name} avatar={user.avatar} size={32} />
                      <div>
                        <span className="block text-sm font-medium">{user.name}</span>
                        <span className="block text-xs text-gray-500">{user.role}</span>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-4"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || selectedUsers.length === 0 || createGroupMutation.isPending}
              className="px-4"
            >
              {createGroupMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creating...
                </span>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ConversationList = React.memo(({ 
  conversations, 
  groups,
  selectedUserId, 
  onSelectUser, 
  isLoading,
  isLoadingGroups,
  onCreateGroup,
  userRole
}: { 
  conversations: Conversation[] | undefined;
  groups: Group[] | undefined;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  isLoading: boolean;
  isLoadingGroups: boolean;
  onCreateGroup: () => void;
  userRole?: string;
}) => {
  // Sort conversations by last message time
  const sortedConversations = conversations?.sort((a, b) => {
    const timeA = new Date(a.lastMessage?.createdAt || 0).getTime();
    const timeB = new Date(b.lastMessage?.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Sort groups by last message time
  const sortedGroups = groups?.sort((a, b) => {
    const timeA = new Date(a.lastMessage?.createdAt || 0).getTime();
    const timeB = new Date(b.lastMessage?.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="pr-4">
        {isLoading || isLoadingGroups ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (!sortedConversations?.length && !sortedGroups?.length) ? (
          <div className="p-4 text-center text-gray-500">No conversations</div>
        ) : (
          <div className="divide-y">
            {/* Groups Section */}
            <div className="p-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Groups</h3>
              {userRole !== "volunteer" && (
                <CreateGroupDialog onGroupCreated={onCreateGroup} />
              )}
            </div>
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
                          <h3 className="font-medium truncate">{group.name}</h3>
                          {group.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                              {group.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400">{group.members.length} members</p>
                          {group.lastMessage && (
                            <p className="text-xs text-gray-500">
                              {format(new Date(group.lastMessage.createdAt), "MMM d, h:mm a")}
                            </p>
                          )}
                        </div>
                        {group.lastMessage && (
                          <p className={cn(
                            "text-sm truncate mt-1",
                            group.lastMessage.isRead ? "text-gray-500" : "text-gray-900 font-medium"
                          )}>
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
                  <h3 className="text-sm font-medium text-gray-500">Direct Messages</h3>
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
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400">{conversation.user.role}</p>
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-500">
                              {format(new Date(conversation.lastMessage.createdAt), "MMM d, h:mm a")}
                            </p>
                          )}
                        </div>
                        <p className={cn(
                          "text-sm truncate mt-1",
                          conversation.lastMessage.isRead ? "text-gray-500" : "text-gray-900 font-medium"
                        )}>
                          {conversation.lastMessage.content}
                        </p>
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
  );
});

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
  groups,
  selectedUserId,
  onSelectUser,
  isLoadingConversations,
  isLoadingGroups,
  availableUsers,
  isLoadingUsers,
  userRole,
  onGroupCreated
}: {
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
));

Sidebar.displayName = 'Sidebar';

// Add this import
import DeleteGroupModal from './DeleteGroupModal';

export const MessageUI: React.FC = () => {
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const utils = trpc.useUtils();

  // Add markAsRead mutation
  const markAsReadMutation = trpc.messages.markAsRead.useMutation({
    onSuccess: () => {
      utils.messages.getConversations.invalidate();
      utils.messages.getGroups.invalidate();
    },
  });

  // Queries with polling
  const { data: conversations, isLoading: isLoadingConversations } = trpc.messages.getConversations.useQuery(undefined, {
    enabled: !!session,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const { data: groups, isLoading: isLoadingGroups } = trpc.messages.getGroups.useQuery(undefined, {
    enabled: !!session,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 5000, // Poll every 5 seconds
  }) as { data: Group[] | undefined; isLoading: boolean };

  const selectedConversation = conversations?.find((c) => c._id === selectedUserId);
  const selectedGroup = groups?.find((g) => g._id === selectedUserId);
  const isGroup = selectedGroup !== undefined;

  const { data: messages, isLoading: isLoadingMessages, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.messages.getMessages.useInfiniteQuery(
    { 
      userId: selectedUserId || "",
      limit: 20
    },
    { 
      enabled: !!selectedUserId && !!session && !isGroup,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: 5000, // Poll every 5 seconds
    }
  );

  const { data: groupMessages, isLoading: isLoadingGroupMessages, fetchNextPage: fetchNextGroupPage, hasNextPage: hasNextGroupPage, isFetchingNextPage: isFetchingNextGroupPage } = trpc.messages.getGroupMessages.useInfiniteQuery(
    { 
      groupId: selectedUserId || "",
      limit: 20
    },
    { 
      enabled: !!selectedUserId && !!session && isGroup,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5000, // Poll every 5 seconds
    }
  );

  const { data: availableUsers, isLoading: isLoadingUsers } = trpc.users.getAvailableUsers.useQuery(undefined, {
    enabled: !!session && session.user?.role !== "volunteer"
  });

  // Mutations
  const sendMessageMutation = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      utils.messages.getMessages.invalidate({ userId: selectedUserId || "" });
      utils.messages.getConversations.invalidate();
      setNewMessage("");
      setTimeout(() => {
        const messagesEnd = document.querySelector('[data-messages-end]');
        messagesEnd?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    }
  });

  const sendGroupMessageMutation = trpc.messages.sendGroupMessage.useMutation({
    onSuccess: () => {
      utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId || "" });
      utils.messages.getGroups.invalidate();
      setNewMessage("");
      setTimeout(() => {
        const messagesEnd = document.querySelector('[data-messages-end]');
        messagesEnd?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    }
  });

  // Handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !session?.user?.id) return;

    if (isGroup) {
      sendGroupMessageMutation.mutate({
        groupId: selectedUserId,
        content: newMessage,
      });
    } else {
      sendMessageMutation.mutate({
        receiverId: selectedUserId,
        content: newMessage,
      });
    }
  };

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

  const handleLoadMore = () => {
    if (isGroup) {
      fetchNextGroupPage();
    } else {
      fetchNextPage();
    }
  };

  const flattenedMessages = isGroup 
    ? groupMessages?.pages.flatMap(page => (page.messages as unknown) as Message[]) 
    : messages?.pages.flatMap(page => (page.messages as unknown) as Message[]);
  
  const hasMore = isGroup ? hasNextGroupPage : hasNextPage;
  const isLoadingMore = isGroup ? isFetchingNextGroupPage : isFetchingNextPage;

  // Ensure we have the correct data before rendering
  const currentConversation = isGroup ? selectedGroup : selectedConversation;
  const isLoadingCurrentMessages = isGroup ? isLoadingGroupMessages : isLoadingMessages;

  // Add the delete mutation
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
    <div className="grid grid-cols-1 md:grid-cols-4 h-full bg-white rounded-lg border">
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

      <main className="col-span-1 md:col-span-3 flex flex-col h-full">
        {selectedUserId && currentConversation ? (
          <>
            <ChatArea
              messages={flattenedMessages}
              isLoadingMessages={isLoadingCurrentMessages}
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
              isSending={isGroup ? sendGroupMessageMutation.isPending : sendMessageMutation.isPending}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </main>

      {showDeleteModal && selectedGroup && session?.user?.role !== "volunteer" && (
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

