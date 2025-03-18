"use client";

import Link from "next/link";
import Image from "next/image";
 
import Logo from "../public/brand_logo.png";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function TopNavigationBar() {
   

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
                <Image src={Logo} alt="AutLEAP Logo" width={32} height={16} />
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              {/* First dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-black hover:bg-black hover:text-blue-600 text-sm font-medium focus:bg-black">
                      Fast volunteer opportunities
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-black border border-gray-800 rounded-lg z-50">
                      <div className="w-48 p-2">
                        <Link href="/opportunities/search" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm text-white">
                          Search Opportunities
                        </Link>
                        <Link href="/opportunities/featured" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm text-white">
                          Featured Opportunities
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Second dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-black hover:bg-black hover:text-blue-600 text-sm font-medium focus:bg-black">
                      AusLEAP
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-black border border-gray-800 rounded-lg z-50">
                      <div className="w-48 p-2">
                        <Link href="/ausleap/about" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm text-white">
                          About AusLEAP
                        </Link>
                        <Link href="/ausleap/testimonials" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm text-white">
                          Testimonials
                        </Link>
                        <Link href="/ausleap/gallery" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm text-white">
                          Gallery
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Regular links */}
              <Link href="/about" className="text-sm font-medium hover:text-blue-600">
                About Us
              </Link>

              <Link href="/faq" className="text-sm font-medium hover:text-blue-600">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}