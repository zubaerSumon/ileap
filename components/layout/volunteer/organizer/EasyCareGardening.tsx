"use client";

import Image from "next/image";
import Link from "next/link";
import Categories from "../homepage/HomePageCategories";

export default function EasyCareGardening() {
  return (
    <div className="bg-white min-h-screen pt-8">
      <div className="max-w-[1280px] mx-auto px-4 mb-8 bg-white rounded-lg shadow-md">
        {/* Cover Image and Logo */}
        <div className="relative mb-6 pt-4">
          <div className="w-full h-[200px] relative rounded-lg overflow-hidden">
            <Image
              src="/pfbg2.svg"
              alt="Clean Up Australia Cover"
              fill
              className="object-cover"
            />

            {/* Logo positioned inside the banner */}
            <div className="absolute bottom-4 left-4 w-[80px] h-[80px] rounded-lg overflow-hidden border-4 border-white bg-white">
              <Image
                src="/Easy.svg"
                alt="Clean Up Australia Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            <button className="absolute right-4 bottom-4 bg-white/80 text-gray-700 px-2 py-1 text-xs rounded-md flex items-center">
              Edit cover photo
            </button>
          </div>
        </div>

        {/* Organization Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start items-center text-center md:text-left gap-6 md:gap-0">
          {/* Left Column - Org Info */}
          <div className="flex flex-col items-center md:items-start gap-1 md:w-1/3">
            <h1 className="text-2xl font-bold">Easy Care Gardening</h1>
            <div className="flex items-center text-gray-600">
              <span className="mr-1">📍</span>
              <span>Sydney, Australia</span>
            </div>
            <div className="mt-1 text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Environmental & Conservation
              </span>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center text-center sm:text-left md:w-2/3">
            <div>
              <h2 className="text-lg font-semibold mb-2">Location</h2>
              <p className="text-gray-700">PO Box 1234</p>
              <p className="text-gray-700">
                Sydney, New South Wales, Australia
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
              <p className="text-gray-700">
                Email -{" "}
                <a
                  href="mailto:info@cleanup.org.au"
                  className="text-blue-600 hover:underline"
                >
                  info@cleanup.org.au
                </a>
              </p>
              <p className="text-gray-700">
                Phone -{" "}
                <a
                  href="tel:0298765432"
                  className="text-blue-600 hover:underline"
                >
                  02 9876 5432
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">About us</h2>
          <p className="text-gray-700">
            CEasy Care Gardening is a volunteer-based gardening service that
            helps senior Australians maintain their homes. Teams of volunteers
            weed, prune, mulch to make gardens safe and tidy, with the aim of
            keeping people in their own homes for longer. We love to see our
            volunteers make connections with the elderly community and feel like
            they are making a real contribution to their local community.
          </p>
        </div>

        {/* Social Media */}
        <div className="mt-8 text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">Find us on:</h2>
          <Link
            href="https://facebook.com"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            <span className="mr-1">📱</span> Facebook
          </Link>
        </div>

        {/* Opportunities */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">All Opportunities</h2>
          <Categories title="" />
        </div>
      </div>
    </div>
  );
}
