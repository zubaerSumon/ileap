'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Volunteer {
  _id: string;
  name: string;
  avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  email: string;
}

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: Volunteer | null;
}

const VolunteerModal = ({ isOpen, onClose, volunteer }: VolunteerModalProps) => {
  const router = useRouter();

  if (!volunteer) return null;

  const handleSendMessage = () => {
    router.push(`/messaging?userId=${volunteer._id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <div className="flex flex-col">
          <div className="relative w-24 h-24">
            <Image
              src={volunteer.avatar || "/avatar.svg"}
              alt={volunteer.name}
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          
          <h2 className="mt-4 text-xl font-semibold">{volunteer.name}</h2>
          
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              volunteer.status === 'approved' 
                ? 'bg-green-50 text-green-600' 
                : volunteer.status === 'rejected'
                ? 'bg-red-50 text-red-600'
                : 'bg-blue-50 text-blue-600'
            }`}>
              {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
            </span>
            <span className="text-gray-600">Applied on {new Date(volunteer.appliedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-4 mt-6">
            <Button className="flex-1 bg-blue-600 text-white" variant="outline">View full profile</Button>
            <Button 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900"
              onClick={handleSendMessage}
            >
              Send message
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t text-sm text-gray-500">
            <div className="flex gap-4">
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