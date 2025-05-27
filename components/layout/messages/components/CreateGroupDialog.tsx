import React, { useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import Avatar from "./Avatar";

interface CreateGroupDialogProps {
  onGroupCreated: () => void;
  userRole?: string;
}

export const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ onGroupCreated, userRole }) => {
  console.log("CreateGroupDialog - User Role:", userRole);
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
      isOrganizationGroup: false
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

export default CreateGroupDialog; 