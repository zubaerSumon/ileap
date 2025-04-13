import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";

export function ReviewContent() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-6 border space-y-4">
          <div className="flex gap-4">
            <div className="relative w-[34px] h-[34px] shrink-0">
              <Image
                src="/avatar.svg"
                alt="User avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
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
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.375 4H8.533C9.05464 4.00077 9.55465 4.20854 9.92323 4.57766C10.2918 4.94679 10.4988 5.44711 10.4988 5.96875V11.4375C10.963 11.4375 11.4081 11.2531 11.7363 10.9249C12.0645 10.5967 12.2488 10.1516 12.2488 9.6875V4.063C12.2488 3.18508 11.5926 2.42325 10.6948 2.348C10.564 2.33738 10.4332 2.32765 10.3023 2.31883C10.1546 2.03433 9.93163 1.79586 9.65769 1.62942C9.38376 1.46298 9.06937 1.37497 8.74883 1.375H7.87383C7.5533 1.37497 7.23891 1.46298 6.96497 1.62942C6.69104 1.79586 6.46808 2.03433 6.32042 2.31883C6.18917 2.32758 6.05792 2.3375 5.92783 2.348C5.05167 2.42208 4.40533 3.1495 4.375 4Z" fill="#2563EB"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.75 5.96875C1.75 5.36442 2.24 4.875 2.84375 4.875H8.53125C9.13558 4.875 9.625 5.365 9.625 5.96875V12.5312C9.625 13.135 9.135 13.625 8.53125 13.625H2.84375C2.55367 13.625 2.27547 13.5098 2.07035 13.3046C1.86523 13.0995 1.75 12.8213 1.75 12.5312V5.96875Z" fill="#2563EB"/>
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
                  </svg>
                  Matching availability
                </div>
                <div className="text-orange-600 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                    <g clip-path="url(#clip0_3189_4519)">
                      <path d="M8 11V10C8 9.46957 7.78929 8.96086 7.41421 8.58579C7.03914 8.21071 6.53043 8 6 8H3C2.46957 8 1.96086 8.21071 1.58579 8.58579C1.21071 8.96086 1 9.46957 1 10V11" stroke="#EA580C" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4.5 6C5.60457 6 6.5 5.10457 6.5 4C6.5 2.89543 5.60457 2 4.5 2C3.39543 2 2.5 2.89543 2.5 4C2.5 5.10457 3.39543 6 4.5 6Z" stroke="#EA580C" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8.00391 5L9.00391 6" stroke="#EA580C" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M11.5039 3.5L9.00391 6" stroke="#EA580C" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                  </svg>
                  3 matched skills
                </div>
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
                  >
                    Shortlist
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
    </div>
  );
}