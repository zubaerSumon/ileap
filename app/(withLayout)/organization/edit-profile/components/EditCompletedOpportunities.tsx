'use client';

import Image from "next/image";
import { MapPin, Star, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { OpportunityDetail } from "./OpportunityDetail";
import { useRouter } from "next/navigation";

export function EditCompletedOpportunities() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  if (selectedCard) {
    return <OpportunityDetail onBack={() => setSelectedCard(null)} />;
  }

  return (
    <div className="w-fit">
      <div className="flex items-center gap-6 border-b mb-6">
        <h2 
          className={`font-medium pb-2 cursor-pointer text-[12px] mt-2 ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('active')}
        >
          Active 
        </h2>
        <h2 
          className={`font-medium pb-2 cursor-pointer text-[12px] mt-2 ${activeTab === 'last12' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('last12')}
        >
          Last 12 months
        </h2>
        <h2 
          className={`font-medium pb-2 cursor-pointer text-[12px] mt-2 ${activeTab === 'archived' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('archived')}
        >
          Archived
        </h2>
      </div>
      
      {activeTab === 'active' && (
        <div className="flex gap-6">
          <OpportunityCard 
            image="/wall.svg"
            title="Seek Help"
            location="Sydney, Australia"
            id="seek-help"
          />
          <OpportunityCard 
            image="/dog.svg"
            title="Environmental Champions"
            location="Sydney, Australia"
            id="environmental-champions"
          />
        </div>
      )}

      {activeTab === 'last12' && (
        <div className="flex gap-6">
          <OpportunityCard 
                      image="/dog.svg"
                      title="Community Support"
                      location="Sydney, Australia" id={""}          />
          <OpportunityCard 
                      image="/wall.svg"
                      title="Youth Mentoring"
                      location="Sydney, Australia" id={""}          />
        </div>
      )}

      {activeTab === 'archived' && (
        <div className="flex gap-6">
          <OpportunityCard 
                      image="/wall.svg"
                      title="Food Drive"
                      location="Sydney, Australia" id={""}          />
          <OpportunityCard 
                      image="/dog.svg"
                      title="Beach Cleanup"
                      location="Sydney, Australia" id={""}          />
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ 
  image, 
  title, 
  location,
  id 
}: { 
  image: string; 
  title: string; 
  location: string;
  id: string;
}) {
  const router = useRouter();

  return (
    <div 
      className="border rounded-xl overflow-hidden w-[300px] h-[260px] cursor-pointer hover:border-blue-200 transition-colors"
      onClick={() => router.push(`/organization/opportunity/${id}`)}
    >
      <div className="relative h-[102px] w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-[14px] font-semibold">{title}</h3>
        <div className="flex items-center gap-1 text-gray-500 mt-0.5">
          <MapPin className="w-3 h-3" />
          <span className="text-[10px]">{location}</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">40+ Participants</p>
        <div className="flex flex-col gap-0.5 mt-1">
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md w-fit">Community & Social Services</span>
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md w-fit">Environmental & Conservation</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 mb-1">27 Jan 2025 - 10:16 pm</p>
        <div className="flex justify-between items-center">
          <Star className="w-3 h-3 text-gray-400" />
          <MoreHorizontal className="w-3 h-3 text-gray-400" />
        </div>
      </div>
    </div>
  );
}