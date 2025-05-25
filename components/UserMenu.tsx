import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { SessionUser } from "@/types/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./ui/menubar";

interface UserMenuProps {
  user: SessionUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      <div className="hidden md:flex flex-col mr-3">
        <span className="text-sm font-medium text-white">
          {user.name || "User"}
        </span>
        <span className="text-xs text-gray-300">{user.email}</span>
      </div>
      <Menubar className="p-0 bg-transparent border-none">
        <MenubarMenu>
          <MenubarTrigger className="p-0 data-[state=open]:bg-gray-800 bg-transparent border-none rounded-full hover:bg-gray-800 cursor-pointer">
            <Avatar className="ring-2 ring-blue-500 border border-white">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-yellow-400 text-black">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </MenubarTrigger>
          <MenubarContent className="bg-white border border-gray-800">
            <MenubarItem className="md:hidden">
              <div className="flex flex-col py-2">
                <span className="text-sm font-medium text-gray-900">
                  {user.name || "User"}
                </span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            </MenubarItem>
            <MenubarSeparator className="md:hidden" />
            <MenubarItem>
              <Link
                href={
                  user.role === pathname?.split("/")[1]
                    ? `/${user.role}/profile`
                    : `/${user.role}`
                }
                className="w-full"
              >
                Edit Profile
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => signOut({ callbackUrl: "/signin" })}>
              Sign out{" "}
              <MenubarShortcut>
                <LogOut className="h-4 w-4" />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
} 