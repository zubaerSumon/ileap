"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Categories from "../homepage/HomePageCategories";

export default function EasyCareGardening() {
  return (
    <>
      <div className="mb-4">
        <Link
          href="/volunteer"
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 bg-white/80 px-3 py-1.5 rounded-lg w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </div>

      <div className=" ">
        <div className="px-4 mb-8">
          <div className="relative mb-6 pt-4">
            {/* <Link
              href="/volunteer/opportunities"
              className="absolute top-6 left-4 z-10 flex items-center text-gray-600 hover:text-blue-600"
            >
              <span className="mr-1">←</span>
              <span>Back</span>
            </Link> */}

            <div className="w-full h-[200px] relative rounded-lg overflow-hidden">
              <Image
                src="/pfbg2.svg"
                alt="Clean Up Australia Cover"
                fill
                className="object-cover"
              />

              <div className="absolute bottom-4 left-4 w-[80px] h-[80px] rounded-lg overflow-hidden border-4 border-white bg-white">
                <Image
                  src="/Easy.svg"
                  alt="Clean Up Australia Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start items-center text-center md:text-left gap-6 md:gap-0">
            <div className="flex flex-col items-center md:items-start gap-1 md:w-1/3">
              <h1 className="text-2xl font-bold">Easy Care Gardening</h1>
              <div className="flex items-center text-gray-600">
                <span className="mr-1">📍</span>
                <span>Pymble, Australia</span>
              </div>
              <div className="flex items-center text-blue-600 underline">
                <Link
                  href="https://www.easycaregardening.org.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline"
                >
                  www.easycaregardening.org.au
                </Link>
              </div>
              <div className="mt-1 text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Seniors & Aged Care
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center text-center sm:text-left md:w-2/3">
              <div>
                <h2 className="text-lg font-semibold mb-2">Location</h2>
                <p className="text-gray-600">PO Box 5337</p>
                <p className="text-gray-600">
                  Pymble, New South Wales, <br />
                  Australia
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
                <p className="text-gray-700">
                  Mail-{" "}
                  <a
                    href="mailto:volunteering@easycaregardening.org.au"
                    className="text-blue-600 hover:underline"
                  >
                    volunteering@easycaregardening.org.au
                  </a>
                </p>
                <p className="text-gray-700">
                  Phone -{" "}
                  <a
                    href="tel:0299831644"
                    className="text-blue-600 hover:underline"
                  >
                    02 9983-1644
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center md:text-left">
            <h2 className="text-lg font-semibold mb-2">About us</h2>
            <p className="text-gray-700">
              Easy Care Gardening is a volunteer-based gardening service that
              helps senior Australians maintain their homes. Teams of volunteers
              weed, prune, mulch to make gardens safe and tidy, with the aim of
              keeping people in their own homes for longer. We love to see our
              volunteers make connections with the elderly community and feel
              like they are making a real contribution to their local community.
            </p>
          </div>

          <div className="mt-8 text-center md:text-left">
            <h2 className="text-lg font-semibold mb-2">Find us on:</h2>
            <Link
              href="https://www.facebook.com/ECG2074/"
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              <span className="mr-1">📱</span> Facebook
            </Link>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">All Opportunities</h2>
            <Categories customizedFor="easy care" />
          </div>
        </div>
      </div>
    </>
  );
}
