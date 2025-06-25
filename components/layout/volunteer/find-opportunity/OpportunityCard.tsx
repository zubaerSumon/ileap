"use client";

import { FavoriteButton } from "@/components/buttons/FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Opportunity } from "@/types/opportunities";
import { MapPin, Users, Calendar, Clock, Building2 } from "lucide-react";
import Link from "next/link";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export default function OpportunityCard({
  opportunity,
}: OpportunityCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden w-full py-0 cursor-pointer relative bg-white h-full">
      <CardContent className="p-4 h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Building2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div className="text-sm text-gray-600 truncate">
                <Link
                  href={`/volunteer/organizer/${opportunity.organization_profile?._id}`}
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {opportunity.organization_profile?.title}
                </Link>
              </div>
            </div>
            <FavoriteButton opportunityId={opportunity._id} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {opportunity.title.charAt(0).toUpperCase() + opportunity.title.slice(1)}
          </h3>

          {/* Location and Spots */}
          <div className="flex items-center gap-3 mb-3 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm truncate">{opportunity.location}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">
                <span className="font-medium text-green-600">
                  {opportunity.number_of_volunteers - (opportunity.recruitCount || 0)}
                </span>{" "}
                spots left
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-3">
            {opportunity.category.slice(0, 2).map((category, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
            {opportunity.category.length > 2 && (
              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                +{opportunity.category.length - 2} more
              </span>
            )}
          </div>

          {/* Description */}
          <div
            className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1"
            dangerouslySetInnerHTML={{ __html: opportunity.description }}
          />

          {/* Footer */}
          <div className="mt-auto">
            {/* Date, Time and Type */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-2">
                {opportunity.date?.start_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    <span>{format(new Date(opportunity.date.start_date), "MMM d")}</span>
                  </div>
                )}
                {opportunity.time?.start_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span>{opportunity.time.start_time}</span>
                  </div>
                )}
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  opportunity.commitment_type === "workbased"
                    ? "border-blue-200 text-blue-700 bg-blue-50"
                    : "border-orange-200 text-orange-700 bg-orange-50"
                }`}
              >
                {opportunity.commitment_type === "workbased" ? "Work" : "Event"}
              </Badge>
            </div>

            {/* Action Button */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full"
            >
              <Link
                href={`/volunteer/opportunities/${opportunity._id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors block"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 