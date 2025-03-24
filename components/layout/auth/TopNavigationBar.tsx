"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import Logo from "../../../public/brand_logo.png";

export default function TopNavigationBar() {
  const pathname = usePathname();
  const isSignInPage = pathname?.includes("signin");

  return (
    <>
      <div className="bg-white sticky">
        <div className="bg-black text-white py-2 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center">
                <Image
                  src={Logo}
                  alt="iLEAP Logo"
                  width={32}
                  height={16}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href={isSignInPage ? "/signup" : "/signin"}
                className="text-sm font-normal hover:text-blue-500"
              >
                {isSignInPage ? "Sign up" : "Sign in"}
              </Link>
              <Link
                href="/support"
                className="text-sm font-normal hover:text-blue-500"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
