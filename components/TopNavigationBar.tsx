"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X,/*  Bell, MessageSquare, */ LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "../public/brand_logo.png";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
import { signOut, useSession } from "next-auth/react";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const publicNavOptions = [
  {
    label: "Support",
    href: "/support",
    className: "hover:underline hidden sm:inline",
  },
  { label: "Log in", href: "/signin", className: "hover:underline" },
  {
    label: "Organisation Sign up",
    href: "/signup?role=organization",
    className: "hover:underline hidden md:inline",
  },
  {
    label: "Volunteer Sign up",
    href: "/signup?role=volunteer",
    className: "hover:underline hidden md:inline",
  },
];

const protectedNavOptions = [
  { label: "Home", href: "/", icon: null },
  // { label: "Opportunities", href: "/opportunities", icon: null },
  // { label: "Find volunteer", href: "/find-volunteer", icon: null },
];

const desktopMenus = [
  {
    title: "Fast volunteer opportunities",
    items: [
      { label: "Search Opportunities", href: "/opportunities/search" },
      { label: "Featured Opportunities", href: "/opportunities/featured" },
    ],
  },
  {
    title: "AusLEAP",
    items: [
      { label: "About AusLEAP", href: "/ausleap/about" },
      { label: "Testimonials", href: "/ausleap/testimonials" },
      { label: "Gallery", href: "/ausleap/gallery" },
    ],
  },
];

const staticLinks = [
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faq" },
];

export default function TopNavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isAuthenticated } = useAuthCheck();
 
  const isAuthPath =
    pathname?.includes("signin") ||
    pathname?.includes("signup") 
  const isProtectedPath =
    pathname?.includes("volunteer") ||
    pathname?.includes("organization") ||
    pathname?.includes("opportunities") ||
    pathname?.includes("find-volunteer");

  useEffect(() => {
    setShowNav(!isProtectedPath || (isProtectedPath && isAuthenticated));
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderDesktopNavMenus = () => (
    <>
      {desktopMenus.map((menu, index) => (
        <NavigationMenu key={index}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-black hover:bg-black hover:text-blue-600 text-sm font-medium focus:bg-black">
                {menu.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-black border border-gray-800 rounded-lg z-50">
                <div className="w-48 p-2">
                  {menu.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="block px-4 py-2 hover:bg-blue-600 rounded text-sm text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ))}

      {staticLinks.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className="text-sm font-medium hover:text-blue-600"
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  const renderMobileMenu = () => (
    <div
      className={`md:hidden bg-black text-white overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-4 py-3 space-y-3 border-t border-gray-800">
        {desktopMenus.map((menu, index) => (
          <div key={index} className="py-2">
            <div className="font-medium mb-2">{menu.title}</div>
            {menu.items.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="block px-4 py-2 hover:bg-blue-600 rounded text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}

        {staticLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="block py-2 hover:text-blue-600"
          >
            {link.label}
          </Link>
        ))}

        <div className="pt-4 border-t border-gray-800">
          {publicNavOptions.map((option, index) => (
            <Link
              key={index}
              href={option.href}
              className={`block py-2 hover:text-blue-600 ${
                option.className?.includes("hidden") ? option.className : ""
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white ${isAuthPath ? "sticky" : ""}`}>
      {!isAuthPath && !isProtectedPath && (
        <div className="bg-blue-600 text-white py-1 px-4">
          <div className="container mx-auto flex justify-end space-x-4 text-sm">
            {publicNavOptions.map((option, index) => (
              <Link key={index} href={option.href} className={option.className}>
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {showNav && (
        <div className="bg-black text-white py-2 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center ">
                <Image
                  src={Logo}
                  alt="iLEAP Logo"
                  width={80}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
              {isProtectedPath && (
                <div className="flex items-center space-x-4">
                  {protectedNavOptions.map((option, index) => (
                    <Link
                      key={index}
                      href={option.href}
                      className="flex items-center space-x-1 text-sm hover:text-blue-500"
                    >
                      {option.icon && <span>{option.icon}</span>}
                      <span>{option.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {isAuthPath ? (
              <div className="flex items-center space-x-4">
                {session ? (
                  <>
                    <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
                      <Avatar className="h-7 w-7 border border-white">
                        <AvatarImage src={session.user?.image || undefined} />
                        <AvatarFallback>
                          {session.user?.name
                            ? session.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">
                        {session.user?.name || "User"}
                      </span>
                      <button
                        onClick={() => signOut({ callbackUrl: "/signin" })}
                        className="ml-2 p-1 rounded-full hover:bg-blue-600 transition-colors"
                        title="Log out"
                      >
                        <LogOut className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href={pathname?.includes("signin") ? "/signup" : "/signin"}
                      className="text-sm font-normal hover:text-blue-500"
                    >
                      {pathname?.includes("signin") ? "Sign up" : "Sign in"}
                    </Link>
                    <Link
                      href="/support"
                      className="text-sm font-normal hover:text-blue-500"
                    >
                      Support
                    </Link>
                  </>
                )}
              </div>
            ) : isProtectedPath ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  {/* <button className="hover:text-blue-500">
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  <button className="hover:text-blue-500">
                    <Bell className="h-5 w-5" />
                  </button> */}

                  <Menubar className="p-0 bg-transparent border-none ">
                    <MenubarMenu>
                      <MenubarTrigger className="p-0 bg-transparent border-none rounded-full">
                        <Avatar className="ring-2 ring-blue-500 border border-white">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem
                          onClick={() => signOut({ callbackUrl: "/signin" })}
                        >
                          Sign out{" "}
                          <MenubarShortcut>
                            <LogOut />
                          </MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Profile</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Settings</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
{/* 
                <Link
                  href="/post-opportunity"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Post an opportunity
                </Link> */}
              </div>
            ) : (
              <>
                <button
                  className="md:hidden text-white focus:outline-none"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>

                <div className="hidden md:flex items-center space-x-6">
                  {renderDesktopNavMenus()}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!isAuthPath && !isProtectedPath && renderMobileMenu()}
    </div>
  );
}
