import Image from "next/image";
import {
  X,
  FileUser,
  MessageCircle,
  SettingsIcon,
  Layers2,
  LayoutDashboard,
} from "lucide-react";
import { Session } from "next-auth";
import Logo from "../../public/AusLeap.png";
import { PUBLIC_NAV_OPTIONS, STATIC_LINKS } from "@/utils/constants/navigation";
import { NavLink } from "./NavLink";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isAuthPath: boolean;
  isProtectedPath: boolean;
  session: Session | null;
  totalUnreadCount: number;
}

export function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
  isAuthPath,
  isProtectedPath,
  session,
  totalUnreadCount,
}: MobileMenuProps) {
  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <div
      id="mobile-menu"
      className={`fixed top-0 left-0 h-full w-72 bg-[#1a1a1a] text-white transform transition-transform duration-300 ease-in-out z-50 ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <Image
            src={Logo}
            alt="iLEAP Logo"
            width={100}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <button
            onClick={handleCloseMenu}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {isAuthPath ? (
            // Auth path menu items
            session ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold">
                    {session.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{session.user?.name}</p>
                    <p className="text-sm text-gray-400">
                      {session.user?.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <NavLink
                    href="/profile"
                    label="Profile"
                    icon={FileUser}
                    onClick={handleCloseMenu}
                  />
                  <NavLink
                    href="/settings"
                    label="Settings"
                    icon={SettingsIcon}
                    onClick={handleCloseMenu}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {PUBLIC_NAV_OPTIONS.map((option, index) => (
                  <NavLink
                    key={index}
                    href={option.href}
                    label={option.label}
                    onClick={handleCloseMenu}
                  />
                ))}
              </div>
            )
          ) : isProtectedPath ? (
            // Protected path menu items
            <div className="space-y-6">
              {session?.user?.role === "organization" && (
                <div className="space-y-1">
                  <NavLink
                    href="/organization/dashboard"
                    label="Dashboard"
                    icon={LayoutDashboard}
                    onClick={handleCloseMenu}
                  />
                  <NavLink
                    href="/organization/opportunities"
                    label="Opportunities"
                    icon={Layers2}
                    onClick={handleCloseMenu}
                  />
                </div>
              )}
              <div className="space-y-1">
                <NavLink
                  href={`/${
                    session?.user?.role === "organization"
                      ? "organisation"
                      : session?.user?.role
                  }/messages`}
                  label="Messages"
                  icon={MessageCircle}
                  showBadge
                  badgeCount={totalUnreadCount}
                  onClick={handleCloseMenu}
                />
                <NavLink
                  href="/profile"
                  label="Profile"
                  icon={FileUser}
                  onClick={handleCloseMenu}
                />
                <NavLink
                  href="/settings"
                  label="Settings"
                  icon={SettingsIcon}
                  onClick={handleCloseMenu}
                />
              </div>
            </div>
          ) : (
            // Public navigation menu items
            <div className="space-y-6">
              <div className="space-y-1">
                {STATIC_LINKS.map((link, index) => (
                  <NavLink
                    key={index}
                    href={link.href}
                    label={link.label}
                    onClick={handleCloseMenu}
                  />
                ))}
              </div>
              {!session && (
                <div className="pt-4 border-t border-gray-800 space-y-1">
                  {PUBLIC_NAV_OPTIONS.map((option, index) => (
                    <NavLink
                      key={index}
                      href={option.href}
                      label={option.label}
                      onClick={handleCloseMenu}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
