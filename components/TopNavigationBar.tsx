"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, FileUser } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { UserMenu } from "./UserMenu";
import { PUBLIC_NAV_OPTIONS, STATIC_LINKS, PROTECTED_PATHS, AUTH_PATHS } from "@/utils/constants/navigation";
import { SessionUser } from "@/types/navigation";
import Logo from "../public/AusLeap.png";

export default function TopNavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isAuthenticated } = useAuthCheck();

  const isAuthPath = AUTH_PATHS.some(path => pathname?.includes(path));
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname?.includes(path));
  const isResetPasswordPath = pathname?.endsWith("reset-password");

  // Fetch conversations to get total unread count
  const { data: conversations } = trpc.messages.getConversations.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if we have cached data
  });

  // Calculate total unread messages
  const totalUnreadCount = conversations?.reduce((total, conv) => total + (conv.unreadCount || 0), 0) || 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowNav(!isProtectedPath || (isProtectedPath && isAuthenticated));
    }
  }, [isProtectedPath, isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerButton = document.getElementById('hamburger-button');
      
      if (mobileMenu && hamburgerButton && 
          !mobileMenu.contains(event.target as Node) && 
          !hamburgerButton.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderMobileMenu = () => (
    <div
      id="mobile-menu"
      className={`fixed top-0 right-0 h-full w-64 bg-black text-white transform transition-transform duration-300 ease-in-out z-50 ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <Image
            src={Logo}
            alt="iLEAP Logo"
            width={80}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {STATIC_LINKS.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="block py-2 hover:text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!session && (
            <div className="pt-4 border-t border-gray-800">
              {PUBLIC_NAV_OPTIONS.map((option, index) => (
                <Link
                  key={index}
                  href={option.href}
                  className="block py-2 hover:text-blue-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          )}

          {session?.user?.role === "organization" && (
            <Link
              href="/organization/opportunity/create"
              className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileUser className="h-4 w-4" />
              Post an opportunity
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const renderTopBar = () => {
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
            <Link href="/signin" className="text-sm font-normal hover:text-blue-500">
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
                {session?.user && <UserMenu user={session.user as SessionUser} />}
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white sticky top-0 z-50">
      {!isAuthPath && !isProtectedPath && !isResetPasswordPath && (
        <div className="bg-blue-600 text-white py-1 px-4">
          <div className="container mx-auto flex justify-end space-x-4 text-sm">
            {PUBLIC_NAV_OPTIONS.map((option, index) => (
              <Link key={index} href={option.href} className={option.className}>
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {renderTopBar()}
      {renderMobileMenu()}
    </div>
  );
}
