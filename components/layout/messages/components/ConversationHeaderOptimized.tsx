import React from "react";
import { Users, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "./Avatar";
import GroupMemberManagement from "./GroupMemberManagement";
import type { Group } from "@/types/message";

interface ConversationHeaderProps {
  user: {
    name: string;
    avatar?: string;
    members?: number;
  } | Group;
  isGroup?: boolean;
  onDeleteGroup?: () => void;
  onDeleteConversation?: () => void;
  onGroupUpdated?: () => void;
  userRole?: string;
  currentUserId?: string;
}

export const ConversationHeaderOptimized: React.FC<ConversationHeaderProps> = ({
  user,
  isGroup,
  onDeleteGroup,
  onDeleteConversation,
  onGroupUpdated,
  userRole,
  currentUserId
}) => {
  if (!user) return null;

  // Helper function to truncate long group names
  const truncateName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
  };

  // Get member count for groups
  const getMemberCount = () => {
    if (!isGroup || !('members' in user) || !Array.isArray(user.members)) return 0;
    return user.members?.length || 0;
  };

  // Get admin count for groups
  const getAdminCount = () => {
    if (!isGroup || !('admins' in user) || !Array.isArray(user.admins)) return 0;
    return user.admins?.length || 0;
  };
  
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white">
      {/* Left side - Avatar and Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isGroup ? (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
        ) : (
          <div className="flex-shrink-0">
            <Avatar name={user.name || ''} avatar={user.avatar} size={32} />
          </div>
        )}
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm sm:text-base truncate text-gray-900">
              {isGroup ? truncateName(user.name, 25) : user.name}
            </h2>
            {isGroup && getAdminCount() > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {getAdminCount()} admin{getAdminCount() !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {isGroup && (
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="h-3 w-3" />
                {getMemberCount()} member{getMemberCount() !== 1 ? 's' : ''}
              </p>
              {getAdminCount() > 0 && getAdminCount() !== getMemberCount() && (
                <span className="text-xs text-gray-400">•</span>
              )}
              {getAdminCount() > 0 && getAdminCount() !== getMemberCount() && (
                <p className="text-xs text-gray-500">
                  {getMemberCount() - getAdminCount()} regular
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Right side - Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Group Member Management - Always visible for groups */}
        {isGroup && onGroupUpdated && user && 'members' in user && Array.isArray(user.members) && (
          <GroupMemberManagement 
            group={user as Group} 
            onGroupUpdated={onGroupUpdated}
          />
        )}
        
        {/* Action Menu - Dropdown for better mobile experience - Hidden for volunteers, but allow group creators */}
        {(userRole !== "volunteer" || (userRole === "volunteer" && isGroup && 'createdBy' in user && user.createdBy === currentUserId)) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isGroup && onDeleteGroup && (
                <>
                  <DropdownMenuItem
                    onClick={onDeleteGroup}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Group
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              {!isGroup && onDeleteConversation && (
                <>
                  <DropdownMenuItem
                    onClick={onDeleteConversation}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Conversation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem className="text-gray-600">
                <span className="text-xs">Group ID: {'_id' in user ? user._id?.substring(0, 8) : 'N/A'}...</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default ConversationHeaderOptimized; 