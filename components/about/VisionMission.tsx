'use client';

import Image from 'next/image';

export default function VisionMission() {
  return (
    <div className="py-16 bg-[#F5F7FA]">
      <div className="container px-4 mx-auto max-w-[1340px]">
        <div className="grid md:grid-cols-1 gap-12">
          <div className="space-y-4">
            <div className="flex flex-col items-start space-x-4">
              <Image
                src="/i1.svg"
                alt="Vision Icon"
                width={32}
                height={32}
                className="text-blue-600 pb-2"
              />
              <h2 className="text-2xl font-bold text-gray-900">Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To be a global platform of inspiration that brings meaningful positive change through social
              impact initiatives.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col items-start space-x-4">
              <Image
                src="/i2.svg"
                alt="Mission Icon"
                width={32}
                height={32}
                className="text-blue-600 pb-2"
              />
              <h2 className="text-2xl font-bold text-gray-900">Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To empower both causes and their volunteers to build sustainable social change through
              seamless collaboration, fostering a world where every act of service creates lasting impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}