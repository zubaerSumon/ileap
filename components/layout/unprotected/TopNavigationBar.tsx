"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../../../public/brand_logo.png";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function TopNavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="bg-white">
        {/* Upper blue navigation bar */}
        <div className="bg-blue-600 text-white py-1 px-4">
          <div className="container mx-auto flex justify-end space-x-4 text-sm">
            <Link href="/support" className="hover:underline hidden sm:inline">
              Support
            </Link>
            <Link href="/auth/login" className="hover:underline">
              Log in
            </Link>
            <Link href="/organization/signup" className="hover:underline hidden md:inline">
              Organisation Sign up
            </Link>
            <Link href="/volunteer-signup" className="hover:underline hidden md:inline">
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

            {/* Mobile menu button */}
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

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
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

        {/* Mobile menu */}
        <div 
          className={`md:hidden bg-black text-white overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-3 space-y-3 border-t border-gray-800">
            <div className="py-2">
              <div className="font-medium mb-2">Fast volunteer opportunities</div>
              <Link href="/opportunities/search" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm">
                Search Opportunities
              </Link>
              <Link href="/opportunities/featured" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm">
                Featured Opportunities
              </Link>
            </div>
            
            {/* Rest of the mobile menu content */}
            <div className="py-2">
              <div className="font-medium mb-2">AusLEAP</div>
              <Link href="/ausleap/about" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm">
                About AusLEAP
              </Link>
              <Link href="/ausleap/testimonials" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm">
                Testimonials
              </Link>
              <Link href="/ausleap/gallery" className="block px-4 py-2 hover:bg-blue-600 rounded text-sm">
                Gallery
              </Link>
            </div>
            
            <Link href="/about" className="block py-2 hover:text-blue-600">
              About Us
            </Link>
            
            <Link href="/faq" className="block py-2 hover:text-blue-600">
              FAQs
            </Link>
            
            <div className="pt-4 border-t border-gray-800">
              <Link href="/support" className="block py-2 hover:text-blue-600 sm:hidden">
                Support
              </Link>
              <Link href="/organization/signup" className="block py-2 hover:text-blue-600 md:hidden">
                Organisation Sign up
              </Link>
              <Link href="/volunteer-signup" className="block py-2 hover:text-blue-600 md:hidden">
                Volunteer Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}