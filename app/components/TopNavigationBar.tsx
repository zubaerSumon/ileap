"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Logo from "../../public/brand_logo.png"

export default function TopNavigationBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageTitle, setPageTitle] = useState("Frequently Asked Questions");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  

  useEffect(() => {
    const path = pathname.split("/").pop();
    let title = "Frequently Asked Questions";

    switch (path) {
      case "":
      case "home":
        title = "Welcome to AutLEAP";
        break;
      case "opportunities":
        title = "Find Volunteer Opportunities";
        break;
      case "about":
        title = "About Us";
        break;
      case "faq":
        title = "Frequently Asked Questions";
        break;
      case "dashboard":
        title =
          session?.user?.role === "organization"
            ? "Organization Dashboard"
            : "Volunteer Dashboard";
        break;
      case "applications":
        title =
          session?.user?.role === "organization"
            ? "Manage Applications"
            : "My Applications";
        break;
      case "settings":
        title = "Account Settings";
        break;
      default:
        title = path
          ? path.charAt(0).toUpperCase() + path.slice(1)
          : "Welcome to AutLEAP";
    }

    setPageTitle(title);
  }, [pathname, session]);

  return (
    <>
      <div className="bg-white">
        {/* Upper blue navigation bar */}
        <div className="bg-blue-600 text-white py-1 px-4">
          <div className="container mx-auto flex justify-end space-x-4 text-sm">
            <Link href="/support" className="hover:underline">
              Support
            </Link>
            <Link href="/auth/login" className="hover:underline">
              Log in
            </Link>
            <Link href="/organization/signup" className="hover:underline">
              Organisation Sign up
            </Link>
            <Link href="/volunteer/signup" className="hover:underline">
              Volunteer Sign up
            </Link>
          </div>
        </div>

        {/* Main black navigation bar */}
        <div className="bg-black text-white py-3 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center">
                <Image
                  src={Logo}
                  alt="AutLEAP Logo"
                  width={32}
                  height={16}
                />
                
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Link
                  href="/opportunities"
                  className="flex items-center text-sm font-medium hover:text-blue-600"
                >
                  Fast volunteer opportunities
                  <ChevronDown size={16} className="ml-1 "/>
                </Link>
              </div>

              <div
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link
                  href="/ausleap"
                  className="flex items-center text-sm font-medium hover:text-blue-600"
                >
                  AusLEAP
                  <ChevronDown size={16} className="ml-1 "/>
                </Link>
                {isDropdownOpen && (
                  <div className="absolute z-50 bg-black text-white py-2 mt-2 rounded-lg shadow-lg">
                    <Link
                      href="/ausleap/about"
                      className="block px-4 py-2 hover:bg-blue-600"
                    >
                      About AusLEAP
                    </Link>
                    <Link
                      href="/ausleap/testimonials"
                      className="block px-4 py-2 hover:bg-blue-600"
                    >
                      Testimonials
                    </Link>
                    <Link
                      href="/ausleap/gallery"
                      className="block px-4 py-2 hover:bg-blue-600"
                    >
                      Gallery
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="text-sm font-medium hover:text-blue-600"
              >
                Testimonials
              </Link>

              <Link
                href="/faq"
                className="text-sm font-medium hover:text-blue-600"
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
