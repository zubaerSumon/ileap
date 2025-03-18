'use client';

import Link from 'next/link';
import { Phone, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Recruit volunteer section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2563EB]">Recruit volunteer</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/volunteer-report" className="text-sm text-gray-600 hover:text-primary">
                  iLEAP volunteer report
                </Link>
              </li>
              <li>
                <Link href="/help-support" className="text-sm text-gray-600 hover:text-primary">
                  Help & support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Terms of Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2563EB]">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faqs" className="text-sm text-gray-600 hover:text-primary">
                  FAQ&apos;s
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link href="/community-service" className="text-sm text-gray-600 hover:text-primary">
                  Community service
                </Link>
                <Link
                  href="/join"
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-full hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Join us!
                </Link>
              </li>
              <li>
                <Link href="/disable-services" className="text-sm text-gray-600 hover:text-primary">
                  Disable Services
                </Link>
              </li>
              <li>
                <Link href="/young-people" className="text-sm text-gray-600 hover:text-primary">
                  Young people
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact us section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2563EB]">Contact us</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>+61 2 9514 2000</p>
              <p>15 Broadway, Ultimo, NSW 2007,</p>
              <p>University of Technology Sydney</p>
              <p>PO Box 123, Ultimo NSW 2007 Australia</p>
            </div>
          </div>

          {/* Find us section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2563EB]">Find us</h3>
            <div className="flex space-x-4">
              <Link href="tel:+61295142000" className="text-gray-600 hover:text-primary">
                <Phone className="h-6 w-6" />
              </Link>
              <Link href="https://www.instagram.com" className="text-gray-600 hover:text-primary">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="https://www.linkedin.com" className="text-gray-600 hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          © Copyright iLeap Volunteer - Category: Australian University - ABN: 77 257 686 961 - {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}