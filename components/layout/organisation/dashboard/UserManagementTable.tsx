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
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            {info.getValue()[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{info.getValue()}</p>
            <p className="text-sm text-muted-foreground">{info.row.original.email}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => (
        <span className="capitalize">{info.getValue()}</span>
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
      <div className="rounded-md">
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
      <div className="flex items-center justify-end space-x-2">
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