import { LogOut, User, MessageCircle, Info } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { SessionUser } from "@/types/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
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
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/utils/trpc";

interface UserMenuProps {
  user: SessionUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const hasInitialized = useRef(false);

   useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
   console.log('UserMenu user object:', {
    name: user.name,
    image: user.image,
    role: user.role
  });
  

  const userRole =
    user.role === "admin" || user.role === "mentor"
      ? "organisation"
      : user.role;
  const userName = user.name || "User";
  const isOrgUser =
    user.role === "organization" ||
    user.role === "admin" ||
    user.role === "mentor";
  const isVolunteer = user.role === "volunteer";
  const organizationName = user.organization_profile?.title || "Organisation";

   const { data: volunteerProfile } =
    trpc.volunteers.getVolunteerProfile.useQuery(undefined, {
      enabled: isVolunteer,
    });

   const updateVolunteerProfile =
    trpc.volunteers.updateVolunteerProfile.useMutation({
      onSuccess: () => {
        // Don't update local state here, let the user's choice persist
        // The server update was successful, so we trust the local state
      },
      onError: (error) => {
        // Revert the switch if update fails
        setIsAvailable(!isAvailable);
        console.error("Failed to update availability:", error.message);
      },
    });

  // Update local state when profile data changes (only on initial load)
  useEffect(() => {
    if (
      volunteerProfile &&
      volunteerProfile.is_available !== undefined &&
      !hasInitialized.current
    ) {
      setIsAvailable(volunteerProfile.is_available);
      hasInitialized.current = true;
    }
  }, [volunteerProfile]);

  const handleAvailabilityChange = (checked: boolean) => {
    setIsAvailable(checked);
    updateVolunteerProfile.mutate({ is_available: checked });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative focus:outline-none cursor-pointer">
          <Avatar className="h-9 w-9 ring-2 ring-blue-500 border border-white transition-transform duration-200 hover:scale-105">
            <AvatarImage
              src={user.image && user.image !== null ? user.image : undefined}
              alt={userName}
            />
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
            {isVolunteer && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between pt-1 cursor-help hover:bg-slate-50 rounded-md px-1 -mx-1 transition-colors duration-200">
                    <span className="text-xs text-muted-foreground font-medium">
                      Open to volunteer
                    </span>
                    <Switch
                      checked={isAvailable}
                      onCheckedChange={handleAvailabilityChange}
                      className="scale-75 cursor-pointer data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-blue-200 hover:scale-90 transition-transform duration-150"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  sideOffset={4} 
                  side={isMobile ? "bottom" : "left"} 
                  align={isMobile ? "center" : "start"} 
                  className="max-w-[180px] p-2.5 bg-slate-900 border-slate-700 shadow-lg"
                >
                  <div className="flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-100">
                        {isAvailable ? "Available for Opportunities" : "Currently Unavailable"}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isAvailable 
                          ? "Organizations can see your profile and contact you for volunteer work."
                          : "Your profile is hidden from organizations. Toggle to become visible again."}
                      </p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
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
          {/* Settings temporarily hidden
          <DropdownMenuItem asChild>
            <Link
              href={`/${userRole}/settings`}
              className="flex items-center cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Settings</span>
            </Link>
          </DropdownMenuItem>
          */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Sign out</span>
          <DropdownMenuShortcut>⌘⇧Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
