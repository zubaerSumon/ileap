import { Button } from "@/components/ui/button";
import { Edit, Share } from "lucide-react";

export function PostContent() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Posted 7 days ago</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex gap-2">
            <Edit className="h-4 w-4" />
            Edit post
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Seek help</h2>
        <p className="text-gray-600 mb-4">
          Are you passionate about animal welfare and ready to take action? We&apos;re seeking compassionate volunteers to help provide care and support to animals in need. Whether you have a few hours or want to dedicate more time, there&apos;s a role for everyone!
        </p>

        <h3 className="font-medium mb-2">Volunteer Roles Available:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Animal Care: Help with feeding, bathing, and providing comfort to rescued animals.</li>
          <li>Transportation: Assist in transporting animals to shelters or veterinary clinics.</li>
          <li>Fundraising & Awareness: Organize or participate in events to raise awareness and funds for animal care.</li>
          <li>Fostering: Provide temporary homes for animals until they&apos;re adopted.</li>
          <li>Social Media & Photography: Share stories and updates online to help find forever homes for animals.</li>
        </ul>

        <h3 className="font-medium mb-2">Why Volunteer with Us?</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
          <li>Make a positive impact on animal lives.</li>
          <li>Join a community of animal lovers.</li>
          <li>Gain new skills and experiences in animal care and welfare.</li>
          <li>Help spread kindness and compassion.</li>
        </ul>
      </div>
    </div>
  );
}