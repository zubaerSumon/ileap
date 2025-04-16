"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Bell, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "../public/brand_logo.png";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
  { label: "Opportunities", href: "/opportunities", icon: null },
  { label: "Find volunteer", href: "/find-volunteer", icon: null },
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
  const pathname = usePathname();

  const isAuthPath =
    pathname?.includes("signin") || pathname?.includes("signup") || pathname?.includes("set-role");
  const isProtectedPath =
    pathname?.includes("volunteer") ||
    pathname?.includes("organization") ||
    pathname?.includes("opportunities") ||
    pathname?.includes("find-volunteer");

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
            </div>
          ) : isProtectedPath ? (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <button className="hover:text-blue-500">
                  <MessageSquare className="h-5 w-5" />
                </button>
                <button className="hover:text-blue-500">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="h-8 w-8 rounded-full bg-gray-600"></div>
              </div>

              <Link
                href="/post-opportunity"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Post an opportunity
              </Link>
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

      {!isAuthPath && !isProtectedPath && renderMobileMenu()}
    </div>
  );
}
