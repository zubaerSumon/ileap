"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, MessageSquare } from "lucide-react";
import Logo from "../../../public/ILEAP.svg";

export default function TopNavigationBar() {
  return (
    <div className="bg-black text-white py-2 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left section */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center">
            <Image src={Logo} alt="iLEAP Logo" width={32} height={16} className="h-8 w-auto" />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-1 text-sm hover:text-blue-500">
              <span>Home</span>
            </Link>
            
            <Link href="/opportunities" className="flex items-center space-x-1 text-sm hover:text-blue-500">
              <span>Opportunities</span>
            </Link>
            
            <Link href="/find-volunteer" className="flex items-center space-x-1 text-sm hover:text-blue-500">
              <span>Find volunteer</span>
            </Link>
          </div>
        </div>

        {/* Right section */}
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
      </div>
    </div>
  );
}