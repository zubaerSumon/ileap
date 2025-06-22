"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FaBriefcase, FaGraduationCap, FaBalanceScale, FaUsers, FaGlobe, FaChild } from 'react-icons/fa';


const organizations = [
  {
    name: "FIND",
    description: "About Us FIND Services was founded in October 2023 to address the growing demand for accessible global job and internship opportunities in the remote work sector. With a vision to connect people worldwide to flexible...",
    location: "DHAKA, DH, BD",
    distance: "4.1 miles",
    updated: "June 13, 2025",
    opportunities: 4,
    categories: [
      { name: "Community", icon: <FaUsers /> },
      { name: "Education & Literacy", icon: <FaGraduationCap /> },
      { name: "Employment", icon: <FaBriefcase /> },
    ],
  },
  {
    name: "Law Arts and Scientific Unit (LASU)",
    description: "Law Arts and Scientific Unit (LASU) is a non-profitable research organisation/institution/legal entity.",
    location: "DHAKA, DH, BD",
    distance: "4.6 miles",
    updated: "January 21, 2025",
    categories: [
        { name: "Education & Literacy", icon: <FaGraduationCap /> },
        { name: "International", icon: <FaGlobe /> },
        { name: "Justice & Legal", icon: <FaBalanceScale /> },
    ],
  },
  {
    name: "Participatory Human Rights Advancement Society",
    description: "Description: Awareness of health, human rights, identifying social problem and providing remedies, fighting against corruption, injustice, discrimination of all kinds, poverty, child labor and social evils and working for the improvement...",
    location: "DHAKA, DH, BD",
    distance: "4.6 miles",
    updated: "April 13, 2024",
    categories: [
        { name: "Children & Youth", icon: <FaChild /> },
        { name: "Education & Literacy", icon: <FaGraduationCap /> },
        { name: "Justice & Legal", icon: <FaBalanceScale /> },
    ],
  },
];

export default function OrganizationsTab() {
  return (
    <div className="bg-white py-8 px-4 md:px-8 lg:px-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Find the Best Nonprofit Organizations in <span className="font-normal">Dhaka</span></h1>
        <p className="text-gray-600 mt-2">
            Learn more about Dhaka volunteer organizations in cause areas like advocacy, health and medicine, seniors, veterans, and more.
        </p>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="relative col-span-1 md:col-span-1">
            <Input
                placeholder="Search by City or Zip Code"
                className="pl-10"
                defaultValue="Dhaka, Bangladesh"
            />
            <button className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold">
              X
            </button>
          </div>
            <Input
                placeholder="Search by Keyword"
                className="col-span-1 md:col-span-1"
            />
            <Select>
                <SelectTrigger className="col-span-1 md:col-span-1">
                    <SelectValue placeholder="Cause Areas" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="advocacy">Advocacy</SelectItem>
                    <SelectItem value="health">Health & Medicine</SelectItem>
                    <SelectItem value="seniors">Seniors</SelectItem>
                    <SelectItem value="veterans">Veterans</SelectItem>
                </SelectContent>
            </Select>
            <Button className="bg-blue-500 text-white hover:bg-blue-600 col-span-1 md:col-span-1">Search</Button>
        </div>
        <div className="text-right mt-2">
            <Button variant="link" className="text-gray-500 text-xs">CLEAR ALL FILTERS</Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
            The Best Volunteer Organizations in Dhaka | VolunteerMatch <br />
            13 nonprofit organizations near Dhaka <br />
            Displaying 1 - 13 of 13 Organizations
        </p>
        <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-xs font-semibold">SORT BY:</span>
            <Button variant="link" className="text-blue-500 font-bold text-sm p-1">Distance</Button>
            <Button variant="link" className="text-gray-600 text-sm p-1">Name</Button>
        </div>
      </div>

      <div className="space-y-6">
        {organizations.map((org, index) => (
          <div key={index} className="grid grid-cols-12 gap-8 border-t border-gray-200 py-6">
            <div className="col-span-8">
              <h2 className="text-xl font-bold text-blue-500 mb-2">{index + 1}. {org.name}</h2>
              <p className="text-gray-700 mb-4">{org.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{org.location}</span>
                <span className="mx-2">|</span>
                <span>Distance: {org.distance}</span>
                <span className="mx-2">|</span>
                <span>Updated: {org.updated}</span>
              </div>
            </div>
            <div className="col-span-4">
              {org.opportunities && (
                <div className="text-right mb-4">
                  <a href="#" className="text-blue-500 font-semibold">{org.opportunities} Active Opportunities</a>
                </div>
              )}
              <div className="space-y-2">
                {org.categories.map((category, i) => (
                  <div key={i} className="flex items-center justify-end text-gray-600">
                    <span>{category.name}</span>
                    <span className="ml-3 text-xl">{category.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 