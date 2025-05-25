import Link from "next/link";
import Image from "next/image";
import { Menu, X, FileUser, MessageCircle } from "lucide-react";
import { Session } from "next-auth";
import { SessionUser } from "@/types/navigation";
import Logo from "../../public/AusLeap.png";
import { STATIC_LINKS } from "@/utils/constants/navigation";
import { UserMenu } from "./UserMenu";

interface TopBarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  showNav: boolean;
  isAuthPath: boolean;
  isProtectedPath: boolean;
  isResetPasswordPath: boolean;
  session: Session | null;
  totalUnreadCount: number;
}

export function TopBar({
  isMenuOpen,
  setIsMenuOpen,
  showNav,
  isAuthPath,
  isProtectedPath,
  isResetPasswordPath,
  session,
  totalUnreadCount,
}: TopBarProps) {
  if (isResetPasswordPath) {
    return (
      <div className="bg-black text-white py-2 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              src={Logo}
              alt="iLEAP Logo"
              width={80}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <Link
            href="/signin"
            className="text-sm font-normal hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (!showNav) return null;

  return (
    <div className="bg-black text-white py-2 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <button
            id="hamburger-button"
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link
            href={
              session
                ? session.user?.role === "organization"
                  ? "/organization"
                  : "/volunteer"
                : "/"
            }
            className="flex items-center"
          >
            <Image
              src={Logo}
              alt="iLEAP Logo"
              width={80}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          {session?.user?.role === "organization" && isProtectedPath && (
            <Link
              href="/organization/opportunities"
              className="text-xs flex items-center gap-2 py-[6px] px-3 bg-[#343434] rounded-md font-medium hover:text-blue-500 hidden md:flex"
            >
              <FileUser className="h-4 w-4" /> Opportunities
            </Link>
          )}
        </div>

        {isAuthPath ? (
          <div className="flex items-center space-x-4">
            {session ? (
              <UserMenu user={session.user as SessionUser} />
            ) : (
              <Link
                href="/signup"
                className="text-sm font-normal hover:text-blue-500"
              >
                Sign up
              </Link>
            )}
          </div>
        ) : isProtectedPath ? (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {session?.user?.role === "organization" && (
                <Link
                  href={`/${session.user.role}/opportunity/create`}
                  className="hidden md:flex h-[33px] px-3 justify-center items-center gap-[6px] rounded-[6px] bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
                >
                  <Image
                    src="/opp.svg"
                    alt="Post opportunity"
                    width={20}
                    height={20}
                  />
                  <span>Post an opportunity</span>
                </Link>
              )}
              <Link
                href={`/${
                  session?.user?.role === "organization"
                    ? "organisation"
                    : session?.user?.role
                }/messages`}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800 transition-colors relative"
              >
                <MessageCircle className="h-6 w-6" />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnreadCount}
                  </span>
                )}
              </Link>
              {session?.user && (
                <UserMenu user={session.user as SessionUser} />
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-6">
            {STATIC_LINKS.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 