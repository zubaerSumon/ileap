'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import VolunteerModal from './VolunteerModal';

export function RecruitsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-6 border space-y-4">
          <div className="flex gap-4">
            
            <div className="flex-1">
              <div className="flex items-center gap-2"><div className="relative w-[34px] h-[34px] shrink-0">
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
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.375 4H8.533C9.05464 4.00077 9.55465 4.20854 9.92323 4.57766C10.2918 4.94679 10.4988 5.44711 10.4988 5.96875V11.4375C10.963 11.4375 11.4081 11.2531 11.7363 10.9249C12.0645 10.5967 12.2488 10.1516 12.2488 9.6875V4.063C12.2488 3.18508 11.5926 2.42325 10.6948 2.348C10.564 2.33738 10.4332 2.32765 10.3023 2.31883C10.1546 2.03433 9.93163 1.79586 9.65769 1.62942C9.38376 1.46298 9.06937 1.37497 8.74883 1.375H7.87383C7.5533 1.37497 7.23891 1.46298 6.96497 1.62942C6.69104 1.79586 6.46808 2.03433 6.32042 2.31883C6.18917 2.32758 6.05792 2.3375 5.92783 2.348C5.05167 2.42208 4.40533 3.1495 4.375 4ZM7.87383 2.25C7.64177 2.25 7.41921 2.34219 7.25512 2.50628C7.09102 2.67038 6.99883 2.89294 6.99883 3.125H9.62383C9.62383 2.89294 9.53165 2.67038 9.36755 2.50628C9.20346 2.34219 8.9809 2.25 8.74883 2.25H7.87383Z" fill="#2563EB"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.75 5.96875C1.75 5.36442 2.24 4.875 2.84375 4.875H8.53125C9.13558 4.875 9.625 5.365 9.625 5.96875V12.5312C9.625 13.135 9.135 13.625 8.53125 13.625H2.84375C2.55367 13.625 2.27547 13.5098 2.07035 13.3046C1.86523 13.0995 1.75 12.8213 1.75 12.5312V5.96875ZM3.5 7.5C3.5 7.38397 3.54609 7.27269 3.62814 7.19064C3.71019 7.10859 3.82147 7.0625 3.9375 7.0625H3.94217C4.0582 7.0625 4.16948 7.10859 4.25153 7.19064C4.33357 7.27269 4.37967 7.38397 4.37967 7.5V7.50467C4.37967 7.6207 4.33357 7.73198 4.25153 7.81403C4.16948 7.89607 4.0582 7.94217 3.94217 7.94217H3.9375C3.82147 7.94217 3.71019 7.89607 3.62814 7.81403C3.54609 7.73198 3.5 7.6207 3.5 7.50467V7.5ZM4.8125 7.5C4.8125 7.38397 4.85859 7.27269 4.94064 7.19064C5.02269 7.10859 5.13397 7.0625 5.25 7.0625H7.4375C7.55353 7.0625 7.66481 7.10859 7.74686 7.19064C7.82891 7.27269 7.875 7.38397 7.875 7.5C7.875 7.61603 7.82891 7.72731 7.74686 7.80936C7.66481 7.89141 7.55353 7.9375 7.4375 7.9375H5.25C5.13397 7.9375 5.02269 7.89141 4.94064 7.80936C4.85859 7.72731 4.8125 7.61603 4.8125 7.5ZM3.5 9.25C3.5 9.13397 3.54609 9.02269 3.62814 8.94064C3.71019 8.85859 3.82147 8.8125 3.9375 8.8125H3.94217C4.0582 8.8125 4.16948 8.85859 4.25153 8.94064C4.33357 9.02269 4.37967 9.13397 4.37967 9.25V9.25467C4.37967 9.3707 4.33357 9.48198 4.25153 9.56403C4.16948 9.64607 4.0582 9.69217 3.94217 9.69217H3.9375C3.82147 9.69217 3.71019 9.64607 3.62814 9.56403C3.54609 9.48198 3.5 9.3707 3.5 9.25467V9.25ZM4.8125 9.25C4.8125 9.13397 4.85859 9.02269 4.94064 8.94064C5.02269 8.85859 5.13397 8.8125 5.25 8.8125H7.4375C7.55353 8.8125 7.66481 8.85859 7.74686 8.94064C7.82891 9.02269 7.875 9.13397 7.875 9.25C7.875 9.36603 7.82891 9.47731 7.74686 9.55936C7.66481 9.64141 7.55353 9.6875 7.4375 9.6875H5.25C5.13397 9.6875 5.02269 9.64141 4.94064 9.55936C4.85859 9.47731 4.8125 9.36603 4.8125 9.25ZM3.5 11C3.5 10.884 3.54609 10.7727 3.62814 10.6906C3.71019 10.6086 3.82147 10.5625 3.9375 10.5625H3.94217C4.0582 10.5625 4.16948 10.6086 4.25153 10.6906C4.33357 10.7727 4.37967 10.884 4.37967 11V11.0047C4.37967 11.1207 4.33357 11.232 4.25153 11.314C4.16948 11.3961 4.0582 11.4422 3.94217 11.4422H3.9375C3.82147 11.4422 3.71019 11.3961 3.62814 11.314C3.54609 11.232 3.5 11.1207 3.5 11.0047V11ZM4.8125 11C4.8125 10.884 4.85859 10.7727 4.94064 10.6906C5.02269 10.6086 5.13397 10.5625 5.25 10.5625H7.4375C7.55353 10.5625 7.66481 10.6086 7.74686 10.6906C7.82891 10.7727 7.875 10.884 7.875 11C7.875 11.116 7.82891 11.2273 7.74686 11.3094C7.66481 11.3914 7.55353 11.4375 7.4375 11.4375H5.25C5.13397 11.4375 5.02269 11.3914 4.94064 11.3094C4.85859 11.2273 4.8125 11.116 4.8125 11Z" fill="#2563EB"/>
                  </svg>
                  10 projects completed
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                    <g clip-path="url(#clip0_3189_4519)">
                      <path d="M8 11V10C8 9.46957 7.78929 8.96086 7.41421 8.58579C7.03914 8.21071 6.53043 8 6 8H3C2.46957 8 1.96086 8.21071 1.58579 8.58579C1.21071 8.96086 1 9.46957 1 10V11" stroke="#16855F" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4.5 6C5.60457 6 6.5 5.10457 6.5 4C6.5 2.89543 5.60457 2 4.5 2C3.39543 2 2.5 2.89543 2.5 4C2.5 5.10457 3.39543 6 4.5 6Z" stroke="#16855F" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8.00391 5L9.00391 6" stroke="#16855F" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M11.5039 3.5L9.00391 6" stroke="#16855F" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3189_4519">
                        <rect width="12" height="12" fill="white" transform="translate(0 0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  Matching availability
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
  
              <div className="flex gap-3 mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-3 min-w-[56px]"
                  >
                    <Star className="w-6 h-6 text-yellow-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-gray-100 hover:bg-gray-200 rounded-[6px] px-6 font-normal"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Recruit
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="bg-[#246BFD] hover:bg-[#246BFD]/90 text-white px-6 rounded-[6px]"
                >
                  Send message
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <VolunteerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}