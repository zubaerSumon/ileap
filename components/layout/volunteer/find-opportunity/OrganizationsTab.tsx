"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaBriefcase, FaGraduationCap, FaBalanceScale, FaUsers, FaGlobe, FaChild, FaHeart, FaLeaf, FaShieldAlt, FaHandHoldingHeart, FaChurch, FaHospital, FaRunning, FaPaw, FaSearch, FaTimes } from 'react-icons/fa';
import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Helper function to map opportunity types to icons
const getOpportunityTypeIcon = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    education: <FaGraduationCap />,
    health: <FaHospital />,
    environment: <FaLeaf />,
    community: <FaUsers />,
    humanRights: <FaShieldAlt />,
    advocacy: <FaBalanceScale />,
    international: <FaGlobe />,
    children: <FaChild />,
    employment: <FaBriefcase />,
    charity: <FaHandHoldingHeart />,
    religious: <FaChurch />,
    youth: <FaChild />,
    arts: <FaHeart />,
    disaster: <FaShieldAlt />,
    sports: <FaRunning />,
    animal: <FaPaw />,
    animal_welfare: <FaPaw />,
    homeless: <FaUsers />,
    seniors: <FaUsers />,
    disability_support: <FaUsers />,
    disaster_relief: <FaShieldAlt />,
    technology: <FaBriefcase />,
    women_empowerment: <FaUsers />,
    refugees: <FaGlobe />,
    mental_health: <FaHeart />,
  };
  
  return iconMap[type] || <FaUsers />;
};

// Helper function to get display name for opportunity type
const getOpportunityTypeDisplayName = (type: string) => {
  const displayMap: Record<string, string> = {
    education: "Education & Literacy",
    health: "Health & Medicine",
    environment: "Environment",
    community: "Community Development",
    humanRights: "Human Rights",
    advocacy: "Advocacy",
    international: "International",
    children: "Children & Youth",
    employment: "Employment",
    charity: "Charity",
    religious: "Religious",
    youth: "Youth",
    arts: "Arts & Culture",
    disaster: "Disaster Relief",
    sports: "Sports & Recreation",
    animal: "Animal Welfare",
    animal_welfare: "Animal Welfare",
    homeless: "Homelessness & Housing",
    seniors: "Senior Support",
    disability_support: "Disability Support",
    disaster_relief: "Disaster Relief",
    technology: "Technology & Digital Literacy",
    women_empowerment: "Women Empowerment",
    refugees: "Refugee & Immigrant Support",
    mental_health: "Mental Health",
  };
  
  return displayMap[type] || type;
};

// Filter Component
const FilterSection = ({ 
  search, 
  setSearch, 
  category, 
  setCategory, 
  onClearFilters 
}: {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  onClearFilters: () => void;
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="education">Education & Literacy</SelectItem>
            <SelectItem value="health">Health & Medicine</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="community">Community Development</SelectItem>
            <SelectItem value="humanRights">Human Rights</SelectItem>
            <SelectItem value="advocacy">Advocacy</SelectItem>
            <SelectItem value="children">Children & Youth</SelectItem>
            <SelectItem value="employment">Employment</SelectItem>
            <SelectItem value="animal_welfare">Animal Welfare</SelectItem>
            <SelectItem value="homeless">Homelessness & Housing</SelectItem>
            <SelectItem value="seniors">Senior Support</SelectItem>
            <SelectItem value="youth">Youth Mentoring</SelectItem>
            <SelectItem value="arts">Arts & Culture</SelectItem>
            <SelectItem value="disability_support">Disability Support</SelectItem>
            <SelectItem value="disaster_relief">Disaster Relief</SelectItem>
            <SelectItem value="technology">Technology & Digital Literacy</SelectItem>
            <SelectItem value="women_empowerment">Women Empowerment</SelectItem>
            <SelectItem value="refugees">Refugee & Immigrant Support</SelectItem>
            <SelectItem value="sports">Sports & Recreation</SelectItem>
            <SelectItem value="mental_health">Mental Health</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2 w-[200px] px-4"
          >
            <FaTimes />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function OrganizationsTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"name" | "updated">("updated");

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = trpc.organizations.getAllOrganizations.useQuery({
    search: debouncedSearch || undefined,
    category: category === "all" ? undefined : category,
    page: currentPage,
    limit: 10,
    sortBy: sortBy,
  });

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: "name" | "updated") => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="bg-white py-8 px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-8 px-4 md:px-8 lg:px-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error loading organizations</h1>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const organizations = data?.organizations || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <div className="bg-white py-8 px-4 md:px-8 lg:px-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Find the Best Organizations</h1>
        <p className="text-gray-600 mt-2">
            Learn more about volunteer organizations.
        </p>
      </div>

      {/* New Filter Component */}
      <FilterSection
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={handleCategoryChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          <p className="font-medium">{total} organizations found</p>
          <p className="text-gray-500">
            Showing {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, total)} of {total}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("name")}
              className={sortBy === "name" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Name
            </Button>
            <Button
              variant={sortBy === "updated" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("updated")}
              className={sortBy === "updated" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Recently Updated
            </Button>
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="space-y-6">
        {organizations.map((org) => (
          <div key={org._id} className="grid grid-cols-12 gap-8 border-t border-gray-200 py-6">
            <div className="col-span-8">
              <h2 className="text-xl font-bold text-blue-500 mb-2">
                <Link href={`/volunteer/organizer/${org._id}`} className="hover:text-blue-700 transition-colors">
                  {org.title}
                </Link>
              </h2>
              <p className="text-gray-700 mb-4">{org.bio}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{org.area}, {org.state}</span>
                <span className="mx-2">|</span>
                <span>Updated: {formatDistanceToNow(new Date(org.updatedAt), { addSuffix: true })}</span>
              </div>
            </div>
            
            {/* Vertical separator line */}
            <div className="col-span-1 flex justify-center">
              <div className="w-px h-full bg-gray-300"></div>
            </div>
            
            <div className="col-span-3">
              {org.opportunityCount > 0 && (
                <div className="text-right mb-4">
                  <Link href={`/volunteer/organizer/${org._id}`} className="text-blue-500 font-semibold hover:text-blue-700 transition-colors">
                    {org.opportunityCount} Active Opportunities
                  </Link>
                </div>
              )}
              <div className="space-y-2">
                {org.opportunity_types.slice(0, 3).map((type: string, i: number) => (
                  <div key={i} className="flex items-center justify-end text-gray-600">
                    <span>{getOpportunityTypeDisplayName(type)}</span>
                    <span className="ml-3 text-xl">{getOpportunityTypeIcon(type)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 