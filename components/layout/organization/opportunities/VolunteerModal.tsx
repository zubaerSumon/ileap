'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import Image from "next/image";

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VolunteerModal = ({ isOpen, onClose }: VolunteerModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <div className="flex flex-col">
          <div className="relative w-24 h-24">
            <Image
              src="/avatar.svg"
              alt="Volunteer"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          
          <h2 className="mt-4 text-xl font-semibold">Tiago Leitao</h2>
          
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Sydney, Australia</span>
            <span className="text-green-600 text-sm">• Available now</span>
          </div>

          <div className="flex gap-4 mt-6">
            <Button className="flex-1 bg-blue-600 text-white" variant="outline">View profile</Button>
            <Button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900">Hire</Button>
          </div>

          <div className="mt-6">
            <h3 className="text-base font-medium mb-2">About volunteer</h3>
            <p className="text-sm text-gray-600">
              Being a student and passionate about protecting our environment, I believe in combining my academic knowledge with practical action. Volunteering not only helps me contribute to the betterment of our planet, but it also allows me to learn, grow, and connect with like-minded individuals who share the same goals.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-base font-medium mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-100">Homeless</Badge>
              <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-100">Disaster Relief</Badge>
              <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-100">Emergency & Safety</Badge>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-base font-medium mb-2">Location</h3>
            <p className="text-sm text-gray-600">21 Darling Dr, Sydney, Australia</p>
            <p className="text-sm text-gray-600 mt-1">ABN - 43 625 460 915</p>
          </div>

          <div className="mt-6 pt-6 border-t text-sm text-gray-500">
            <p>Member since June 4, 2024</p>
            <div className="flex gap-4 mt-4">
              <button className="text-gray-500 hover:text-gray-700">Report</button>
              <button className="text-gray-500 hover:text-gray-700">Block</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerModal;