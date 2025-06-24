"use client";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const columnHelper = createColumnHelper<User>();

function useUserMutations() {
  const utils = trpc.useUtils();

  const updateRoleMutation = trpc.users.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated successfully");
      utils.users.getOrganizationUsers.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });

  const deleteUserMutation = trpc.users.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("User deleted successfully");
      utils.users.getOrganizationUsers.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  return {
    updateRoleMutation,
    deleteUserMutation,
  };
}

export default function UserManagementTable({ organizationId }: { organizationId: string }) {
  const { data: session } = useSession();
  const { data: users, isLoading } = trpc.users.getOrganizationUsers.useQuery(
    { organizationId },
    { enabled: !!organizationId }
  );
  const { updateRoleMutation, deleteUserMutation } = useUserMutations();

  const handleUpdateRole = useCallback((userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "mentor" : "admin";
    updateRoleMutation.mutate({
      userId,
      role: newRole,
    });
  }, [updateRoleMutation]);

  const handleDeleteUser = useCallback((userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate({
        userId,
      });
    }
  }, [deleteUserMutation]);

  const filteredUsers = useMemo(() => 
    users?.filter(user => user._id !== session?.user?.id) || [],
    [users, session?.user?.id]
  );

  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
            {info.getValue()[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm sm:text-base truncate">{info.getValue()}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{info.row.original.email}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => (
        <span className="capitalize text-sm sm:text-base">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const currentUserRole = session?.user?.role || "";
        const targetUserRole = info.row.original.role;
        const canDelete = currentUserRole === "admin" || 
          (currentUserRole === "mentor" && targetUserRole === "mentor");

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currentUserRole === "admin" && (
                <DropdownMenuItem
                  onClick={() => handleUpdateRole(info.row.original._id, targetUserRole)}
                >
                  Change to {targetUserRole === "admin" ? "Mentor" : "Admin"}
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteUser(info.row.original._id)}
                >
                  Delete User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ], [session?.user?.role, handleUpdateRole, handleDeleteUser]);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden sm:block rounded-md">
        <table className="w-full caption-bottom text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {table.getRowModel().rows.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        ) : (
          table.getRowModel().rows.map((row) => {
            const user = row.original;
            const currentUserRole = session?.user?.role || "";
            const targetUserRole = user.role;
            const canDelete = currentUserRole === "admin" || 
              (currentUserRole === "mentor" && targetUserRole === "mentor");

            return (
              <div key={row.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {currentUserRole === "admin" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(user._id, targetUserRole)}
                        >
                          Change to {targetUserRole === "admin" ? "Mentor" : "Admin"}
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Role:</span>
                  <span className="capitalize text-sm font-medium">{user.role}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 