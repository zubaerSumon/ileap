import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "./Avatar";

interface User {
  _id: string;
  name: string;
  avatar: string;
  role: string;
}

interface UserListProps {
  users: User[] | undefined;
  onSelectUser: (userId: string) => void;
  isLoading: boolean;
}

export const UserList: React.FC<UserListProps> = React.memo(({ 
  users, 
  onSelectUser, 
  isLoading 
}) => (
  <ScrollArea className="flex-1">
    <div className="pr-2 sm:pr-4">
      {isLoading ? (
        <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
      ) : users?.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">No users found</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {users?.map((user) => (
            <button
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              className="w-full p-3 sm:p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Avatar name={user.name} avatar={user.avatar} size={32} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium truncate text-sm sm:text-base">{user.name}</h3>
                  <p className="text-xs text-gray-400 truncate">{user.role}</p>
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

export default UserList; 