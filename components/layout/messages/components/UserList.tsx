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

export default UserList; 