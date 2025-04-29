"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "../public/AusLeap.png";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

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

const desktopMenus = [
  // {
  //   title: "Fast volunteer opportunities",
  //   items: [
  //     { label: "Search Opportunities", href: "/opportunities/search" },
  //     { label: "Featured Opportunities", href: "/opportunities/featured" },
  //   ],
  // },
  {
    title: "AusLEAP",
    items: [
      { label: "About AusLEAP", href: "/ausleap/about" },
      // { label: "Testimonials", href: "/ausleap/testimonials" },
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
  const [showNav, setShowNav] = useState(false); // Initialize as false
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isAuthenticated } = useAuthCheck();

  const isAuthPath =
    pathname?.includes("signin") ||
    pathname?.includes("signup") ||
    pathname?.endsWith("reset-password");
  const isProtectedPath =
    pathname?.includes("volunteer") ||
    pathname?.includes("organization") ||
    pathname?.includes("opportunities") ||
    pathname?.includes("find-volunteer");

  const isResetPasswordPath = pathname?.endsWith("reset-password");

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderDesktopNavMenus = () => (
    <>
      {desktopMenus.map((menu, index) => (
        <NavigationMenu key={index}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-blue-600 text-sm font-medium focus:bg-transparent">
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
      className={`md:hidden bg-black  text-white overflow-hidden transition-all duration-300 ease-in-out ${
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
    <div className="bg-white sticky top-0 z-50">
      {!isAuthPath && !isProtectedPath && !isResetPasswordPath && (
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

      {isResetPasswordPath ? (
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
      ) : (
        showNav && (
          <div className="bg-black text-white py-2 px-6">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <Link
                  href={session ? "/volunteer" : "/"}
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
                <div className="hidden md:flex items-center justify-center space-x-4">
                  <a
                    href="https://www.instagram.com/aus_leap?igsh=cmxsc3lhZXphcmZu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300"
                  >
                    <FaInstagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ausleap/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300"
                  >
                    <FaLinkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {isAuthPath ? (
                <div className="flex items-center space-x-4">
                  {session ? (
                    <>
                      <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
                        <Avatar className="h-7 w-7 border border-white">
                          <AvatarImage src={session?.user?.image || ""} />
                          <AvatarFallback>
                            {session?.user?.name
                              ? session.user.name[0].toUpperCase()
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
                        href={
                          pathname?.includes("signin") ? "/signup" : "/signin"
                        }
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
                    <div className="flex items-center space-x-3">
                      <Avatar className="ring-2 ring-blue-500 border border-white">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-yellow-400 text-black">
                          {session?.user?.name
                            ? session.user.name[0].toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-[120px]">
                          {session?.user?.name
                            ? session.user.name.split(" ")[0]
                            : "User"}
                        </span>
                        <span className="text-xs text-white hidden md:block truncate max-w-[120px]">
                          {session?.user?.email}
                        </span>
                      </div>

                      <Menubar className="p-0 bg-transparent border-none">
                        <MenubarMenu>
                          <MenubarTrigger className="p-0 bg-transparent border-none rounded-full hover:bg-gray-800 px-2">
                            <Menu className="h-5 w-5" />
                          </MenubarTrigger>
                          <MenubarContent className="bg-white border border-gray-800">
                            <MenubarItem>
                              <Link
                                href="/volunteer/profile"
                                className="w-full"
                              >
                                Edit Profile
                              </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem
                              onClick={() =>
                                signOut({ callbackUrl: "/signin" })
                              }
                            >
                              Sign out{" "}
                              <MenubarShortcut>
                                <LogOut />
                              </MenubarShortcut>
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>
                  </div>
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
        )
      )}

      {!isAuthPath &&
        !isProtectedPath &&
        !isResetPasswordPath &&
        renderMobileMenu()}
    </div>
  );
}
