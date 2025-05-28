import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Star } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function SearchVolunteer() {
  return (
    <div className="container max-w-[1240px] max-h-auto mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Search Volunteers</h1>
            <p className="text-[11px] text-gray-500">87 opportunities found</p>
          </div>
          <div className="relative max-w-[333px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input 
              placeholder="Search volunteers" 
              className="pl-10 bg-gray-50 border-0"
            />
          </div>
        </div>
        <div className="mt-8">
          <Select defaultValue="recently-added">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recently-added">Recently added</SelectItem>
              <SelectItem value="recently-active">Recently active</SelectItem>
              <SelectItem value="responsiveness">Responsiveness</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="relative w-[34px] h-[34px] shrink-0">
                    <Image
                      src="/avatar.svg"
                      alt="User avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">John Smith</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Verified</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Sydney, Australia
                  </div>
                  <div className="text-orange-600">3 matched skills</div>
                </div>

                <div className="flex gap-2 mt-2">
                  {['Human Rights', 'Health & Medicine', 'Education & Literacy'].map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mt-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                </p>

                <div className="flex gap-3 mt-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-3 min-w-[56px]"
                    >
                      <Star className="w-5 h-5 text-yellow-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-6 font-normal"
                    >
                      Recruit
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#246BFD] hover:bg-[#246BFD]/90 text-white px-6 rounded-[6px]"
                  >
                    Send message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}