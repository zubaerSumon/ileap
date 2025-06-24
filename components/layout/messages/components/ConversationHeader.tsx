import React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar from "./Avatar";

interface User {
  name: string;
  avatar?: string;
  members?: number;
}

interface ConversationHeaderProps {
  user: User;
  isGroup?: boolean;
  onDeleteGroup?: () => void;
  onDeleteConversation?: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  user,
  isGroup,
  onDeleteGroup,
  onDeleteConversation
}) => {
  if (!user) return null;
  
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isGroup ? (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          </div>
        ) : (
          <div className="flex-shrink-0">
            <Avatar name={user.name || ''} avatar={user.avatar} size={32} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm sm:text-base truncate">
            {user.name}
          </h2>
          {isGroup && user.members !== undefined && (
            <p className="text-xs sm:text-sm text-gray-500">{user.members} members</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {isGroup && onDeleteGroup && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteGroup}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Delete Group</span>
            <span className="sm:hidden">Delete</span>
          </Button>
        )}
        {!isGroup && onDeleteConversation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteConversation}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Delete Conversation</span>
            <span className="sm:hidden">Delete</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConversationHeader;