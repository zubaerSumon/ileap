import React from "react";
import { Menu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar from "./Avatar";

interface User {
  name: string;
  avatar?: string;
  members?: number;
}

interface ConversationHeaderProps {
  user: User;
  onMenuClick: () => void;
  isGroup?: boolean;
  onDeleteGroup?: () => void;
  onDeleteConversation?: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  user,
  onMenuClick,
  isGroup,
  onDeleteGroup,
  onDeleteConversation
}) => {
  if (!user) return null;
  
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        {isGroup ? (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
        ) : (
          <Avatar name={user.name || ''} avatar={user.avatar} />
        )}
        <div>
          <h2 className="font-semibold">
            {user.name}
          </h2>
          {isGroup && user.members !== undefined && (
            <p className="text-sm text-gray-500">{user.members} members</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isGroup && onDeleteGroup && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteGroup}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Delete Group
          </Button>
        )}
        {!isGroup && onDeleteConversation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteConversation}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Delete Conversation
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;