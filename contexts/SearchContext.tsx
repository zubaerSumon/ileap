"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
  searchQuery: string;
  categories: string[];
  commitmentType: "all" | "workbased" | "eventbased";
  location: string;
  availability: {
    startDate: string;
    endDate: string;
  } | null;
}

interface SearchContextType {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setCategories: (categories: string[]) => void;
  setCommitmentType: (type: "all" | "workbased" | "eventbased") => void;
  setLocation: (location: string) => void;
  setAvailability: (availability: { startDate: string; endDate: string } | null) => void;
  clearAllFilters: () => void;
  // Legacy support
  searchQuery: string;
}

const defaultFilters: FilterState = {
  searchQuery: "",
  categories: [],
  commitmentType: "all",
  location: "",
  availability: null,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const setCategories = (categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  };

  const setCommitmentType = (type: "all" | "workbased" | "eventbased") => {
    setFilters(prev => ({ ...prev, commitmentType: type }));
  };

  const setLocation = (location: string) => {
    setFilters(prev => ({ ...prev, location }));
  };

  const setAvailability = (availability: { startDate: string; endDate: string } | null) => {
    setFilters(prev => ({ ...prev, availability }));
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <SearchContext.Provider value={{ 
      filters,
      setSearchQuery,
      setCategories,
      setCommitmentType,
      setLocation,
      setAvailability,
      clearAllFilters,
      // Legacy support
      searchQuery: filters.searchQuery,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
} 