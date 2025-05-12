"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { usePathname, /* useSearchParams */ } from "next/navigation";
import Logo from "../public/AusLeap.png";
// import { FaInstagram, FaLinkedin } from "react-icons/fa";

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
    label: "Volunteer-Sign up",
    href: "/signup?role=volunteer",
    className: "hover:underline hidden md:inline",
  },
];

// const desktopMenus = [
//   {
//     // title: "About AusLEAP",
//     // href: "/ausleap/about"
//   },
// ];

const staticLinks = [
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faq" },
  { label: "Gallery", href: "/ausleap/gallery" },
];

export default function TopNavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isAuthenticated } = useAuthCheck();
  //const searchParams = useSearchParams();
  //const paramRole = searchParams?.get("role");
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
      {/* {desktopMenus.map((menu, index) => (
        // <Link
        //   key={index}
        //   href={menu.href}
        //   className="text-sm font-medium hover:text-blue-600"
        // >
        //   {menu.title}
        // </Link>
      ))} */}

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
        {/* {desktopMenus.map((menu, index) => (
          <Link
            key={index}
            href={menu.href}
            className="block py-2 hover:text-blue-600"
          >
            {menu.title}
          </Link>
        ))} */}

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
                  href={session ? (session.user?.role === 'organization' ? '/organization' : '/volunteer') : '/'}
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
                      {isAuthPath && !pathname?.includes("signin") ? (
                        <div className="flex items-center text-sm space-x-3">
                          {/* <p>
                            {paramRole === "organization"
                              ? "Want to help out?"
                              : ""}{" "}
                          </p> */}
                          {/* <Link
                            href={
                              paramRole === "organization"
                                ? "/signup"
                                : "/signup?role=organization"
                            }
                            className="text-sm font-normal text-blue-600 hover:text-blue-700"
                          >
                            {`Join as ${
                              paramRole === "organization"
                                ? "a Volunteer"
                                : "an Organization"
                            }`}
                          </Link> */}
                        </div>
                      ) : (
                        <Link
                          href="/signup"
                          className="text-sm font-normal hover:text-blue-500"
                        >
                          Sign up
                        </Link>
                      )}
                    </>
                  )}
                </div>
              ) : isProtectedPath ? (
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    {session?.user?.role === 'organization' && (
                      <Link
                        href="/organization/post-opportunity"
                        className="flex h-[33px] px-3 justify-center items-center gap-[6px] rounded-[6px] bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
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
                    <div className="hidden md:flex flex-col mr-3">
                      <span className="text-sm font-medium text-white">
                        {session?.user?.name || "User"}
                      </span>
                      <span className="text-xs text-gray-300">
                        {session?.user?.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Menubar className="p-0 bg-transparent border-none">
                        <MenubarMenu>
                          <MenubarTrigger className="p-0 data-[state=open]:bg-gray-800 bg-transparent border-none rounded-full hover:bg-gray-800 cursor-pointer">
                            <Avatar className="ring-2 ring-blue-500 border border-white">
                              <AvatarImage src={session?.user?.image || ""} />
                              <AvatarFallback className="bg-yellow-400 text-black">
                                {session?.user?.name
                                  ? session.user.name[0].toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                          </MenubarTrigger>
                          <MenubarContent className="bg-white border border-gray-800">
                            <MenubarItem className="md:hidden">
                              <div className="flex flex-col py-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {session?.user?.name || "User"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {session?.user?.email}
                                </span>
                              </div>
                            </MenubarItem>
                            <MenubarSeparator className="md:hidden" />
                            <MenubarItem>
                              <Link href="/volunteer/profile" className="w-full">
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
