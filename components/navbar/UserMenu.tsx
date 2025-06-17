import { LogOut, Settings, User, MessageCircle } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { SessionUser } from "@/types/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface UserMenuProps {
  user: SessionUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const userRole =
    user.role === "admin" || user.role === "mentor"
      ?  "organisation"
      : user.role;
  const userName = user.name || "User";
  const isOrgUser =
    user.role === "organization" ||
    user.role === "admin" ||
    user.role === "mentor";
  const organizationName = user.organization_profile?.title || "Organization";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative focus:outline-none">
          <Avatar className="h-9 w-9 ring-2 ring-blue-500 border border-white transition-transform duration-200 hover:scale-105">
            <AvatarImage src={user.image || ""} alt={userName} />
            <AvatarFallback className="bg-blue-600 text-white">
              {userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p
              className="text-sm font-medium leading-none truncate max-w-[200px]"
              title={userName}
            >
              {userName.charAt(0).toUpperCase() + userName.slice(1)}
            </p>
            {isOrgUser && (
              <p
                className="text-xs leading-none text-muted-foreground truncate max-w-[200px]"
                title={organizationName}
              >
                {organizationName}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={`/${userRole}/profile`}
              className="flex items-center cursor-pointer"
            >
              <User className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${userRole}/messages`}
              className="flex items-center cursor-pointer"
            >
              <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Messages</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${userRole}/settings`}
              className="flex items-center cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/signin" })}
        >
          <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Sign out</span>
          <DropdownMenuShortcut>⌘⇧Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
