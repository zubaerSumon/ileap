'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import NewMessageModal from './NewMessageModal';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Menu,
  Paperclip,
  Shield,
  Trash2,
  MoreVertical,
  MapPin,
  X,
  User
} from "lucide-react"
import DeleteConversationModal from './DeleteConversationModal';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    name: string;
    avatar: string;
  };
}

interface MessageUIProps {
  currentUser: {
    name: string;
    avatar: string;
    location?: string;
  };
}

export const MessageUI: React.FC<MessageUIProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [, setFilter] = useState('All');
  const [, setShowFilterDropdown] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filterOptions = ['All', 'Unread', 'Favorites', 'Contacts', 'Archived', 'Groups'];

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      sender: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleNewMessage = (recipient: string, message: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      sender: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
    };
    setMessages([...messages, newMsg]);
  };

  const handleDeleteConversation = () => {
    setMessages([]);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex h-[800px] bg-white relative m-4 border rounded-lg overflow-hidden">
      {/* Left Sidebar */}
      <div className={`${showMobileMenu ? 'fixed inset-0 z-50 bg-white' : 'hidden'} md:relative md:block md:w-1/4 border-r flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNewMessageModal(true)}
              >
                <span className="sr-only">New Message</span>
                <Plus className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">Filter</span>
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setShowFilterDropdown(false);
                      }}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
            <Input
              type="text"
              placeholder="Search messages"
            />
          </div>
        </div>
        
        {/* Message List */}
        <ScrollArea className="flex-1">
          {messages.map((message) => (
            <Card key={message.id} className="mx-2 my-1 shadow-none border-0 hover:bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{message.sender.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{message.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <CardContent className="p-4">
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
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-semibold">{currentUser.name}</h2>
                  {currentUser.location && (
                    <p className="text-sm text-gray-500">{currentUser.location}</p>
                  )}
                </div>
              </div>
             
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Shield</span>
                  <Shield className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <span className="sr-only">Trash</span>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowRightSidebar(!showRightSidebar)}
                  className="md:hidden"
                >
                  <span className="sr-only">Profile</span>
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">More</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Messages Container */}
        <ScrollArea className="flex-1 px-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-3 ${
                message.sender.name === currentUser.name ? 'justify-end' : 'justify-start'
              }`}
            >
              <Card className={`max-w-[70%] shadow-sm ${
                message.sender.name === currentUser.name
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <CardContent className="p-3">
                  <p>{message.content}</p>
                  <span className="text-xs mt-1 block">
                    {format(message.timestamp, 'h:mm a')}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <form onSubmit={sendMessage}>
            <div className="flex gap-2 items-center">
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write message......"
                className="h-10" // Added fixed height to match button
              />
              <Button type="submit">
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar - User Profile */}
      <Card className={`${showRightSidebar ? 'fixed inset-0 z-50 bg-white' : 'hidden'} md:relative md:block md:w-1/4 rounded-none border-l border-r-0 border-t-0 border-b-0`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center md:hidden">
            <h2 className="font-semibold">Profile</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowRightSidebar(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <Image
              src={currentUser.avatar}
              alt={currentUser.name}
              width={80}
              height={80}
              className="rounded-full mx-auto"
            />
            <h2 className="mt-4 font-semibold text-xl">{currentUser.name}</h2>
            {currentUser.location && (
              <p className="text-gray-500 mt-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                {currentUser.location}
              </p>
            )}
            <Button className="mt-4 w-full">
              View profile
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Homeless</Badge>
              <Badge variant="secondary">Disaster Relief</Badge>
              <Badge variant="secondary">Emergency & Safety</Badge>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Language</h3>
            <p>English</p>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">Member since June 4, 2024</p>
          </div>
        </CardContent>
      </Card>

      {/* Add NewMessageModal */}
      {showNewMessageModal && (
        <NewMessageModal
          onClose={() => setShowNewMessageModal(false)}
          onSend={handleNewMessage}
          currentUser={currentUser}
        />
      )}
      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConversationModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteConversation}
        />
      )}
    </div>
  );
};

export default MessageUI;