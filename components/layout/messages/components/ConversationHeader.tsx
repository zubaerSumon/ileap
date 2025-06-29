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
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  user,
  isGroup,
  onDeleteGroup,
  onDeleteConversation,
  onGroupUpdated
}) => {
  if (!user) return null;

  // Helper function to get text size class based on name length
  const getTextSizeClass = (name: string) => {
    const length = name.length;
    if (length <= 15) return "text-sm sm:text-base"; // Default size
    if (length <= 25) return "text-xs sm:text-sm"; // Medium size
    if (length <= 35) return "text-xs"; // Small size
    return "text-xs"; // Very small for very long names
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

  // Get mentor count for groups
  const getMentorCount = () => {
    if (!isGroup || !('admins' in user) || !Array.isArray(user.admins)) return 0;
    return user.admins?.filter(admin => admin.role === "volunteer").length || 0;
  };

  // Get regular admin count (excluding mentors)
  const getRegularAdminCount = () => {
    if (!isGroup || !('admins' in user) || !Array.isArray(user.admins)) return 0;
    return user.admins?.filter(admin => admin.role !== "volunteer").length || 0;
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
            <h2 className={`font-semibold truncate text-gray-900 ${isGroup ? getTextSizeClass(user.name) : 'text-sm sm:text-base'}`}>
              {user.name}
            </h2>
            {isGroup && getAdminCount() > 0 && (
              <div className="flex items-center gap-1">
                {getMentorCount() > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                    {getMentorCount()} mentor{getMentorCount() !== 1 ? 's' : ''}
                  </span>
                )}
                {getRegularAdminCount() > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex-shrink-0">
                    {getRegularAdminCount()} admin{getRegularAdminCount() !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {isGroup && (
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="h-3 w-3" />
                {getMemberCount()} member{getMemberCount() !== 1 ? 's' : ''}
              </p>
              {(getMentorCount() > 0 || getRegularAdminCount() > 0) && (
                <span className="text-xs text-gray-400">•</span>
              )}
              {getMentorCount() > 0 && (
                <p className="text-xs text-blue-600">
                  {getMentorCount()} mentor{getMentorCount() !== 1 ? 's' : ''}
                </p>
              )}
              {getMentorCount() > 0 && getRegularAdminCount() > 0 && (
                <span className="text-xs text-gray-400">•</span>
              )}
              {getRegularAdminCount() > 0 && (
                <p className="text-xs text-yellow-600">
                  {getRegularAdminCount()} admin{getRegularAdminCount() !== 1 ? 's' : ''}
                </p>
              )}
              {(getMentorCount() > 0 || getRegularAdminCount() > 0) && (
                <span className="text-xs text-gray-400">•</span>
              )}
              {(getMentorCount() > 0 || getRegularAdminCount() > 0) && (
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
        
        {/* Action Menu - Dropdown for better mobile experience */}
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ConversationHeader;