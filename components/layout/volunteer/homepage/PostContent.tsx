import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { trpc } from "@/utils/trpc";

export function PostContent({ opportunityId }: { opportunityId?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedEvents, setAppliedEvents] = useState<string[]>([]);

  const { data: profileData } = trpc.users.profileCheckup.useQuery();

  useEffect(() => {
    if (profileData?.volunteerProfile?.applied_events) {
      setAppliedEvents(profileData.volunteerProfile.applied_events);
    }
  }, [profileData]);

  const getOpportunityDetails = (id?: string) => {
    if (id === "4") {
      return {
        id: "4",
        title: "Gardening Volunteer",
        organization: "Easy Care Gardening",
        date: "20/05/2025",
        time: "10:00 AM - 02:00 PM",
        location: "West Pymble, NSW, 2073",
        logo: "/images/easy-care-gardening-logo.png",

      };
    }
    if (id === "2") {
      return {
        id: "2",
        title: "Clean Up Volunteer",
        organization: "Clean Up Australia",
        date: "21/05/2025",
        time: "01:00 PM - 04:00 PM",
        location: "Hyde Park, Sydney",
        logo: "/images/clean-up-australia-logo.png",
      };
    }
    return {
      id: "1",
      title: "Gardening Volunteer",
      organization: "Easy Care Gardening",
      date: "20/05/2025",
      time: "10:00 AM - 02:00 PM",
      location: "Putney, NSW,  2112",
      logo: "/images/easy-care-gardening-logo.png",
    };
  };

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  if (opportunityId === "2") {
    return (
      <div className="flex-1 max-w-3xl">
        <div className="w-full h-[200px] relative mb-6">
          <Image
            src="/clean0.svg"
            alt="Clean Up Volunteer Banner"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Clean Up Volunteer</h1>

        <div className="text-sm text-gray-600 mb-3">
          Posted by
          <Link href="/volunteer/organizer/clean-up-australia">
            <span className="text-blue-600 hover:underline cursor-pointer">
              {" "}
              Clean Up Australia
            </span>
          </Link>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-4">
          <p className="text-base leading-relaxed">
            Want to help protect Australia&apos;s parks, beaches, and waterways
            from litter and waste? Clean Up Australia is looking for
            enthusiastic volunteers to help clean up general waste from our
            parks, beaches, and other public spaces.
          </p>

          <p className="text-base leading-relaxed">
            As a volunteer, you&apos;ll join a nationwide movement of people
            dedicated to keeping Australia clean and healthy. You&apos;ll work
            together to remove litter, protect our natural environment, and make
            a positive impact on your local community.
          </p>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              What you&apos;ll be doing:
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-base">
              <li>
                Participating in clean-up events at various public locations
              </li>
              <li>Collecting and bagging general waste and litter</li>
              <li>
                Helping to keep our parks, beaches, bushlands, and waterways
                tidy
              </li>
              <li>
                Contributing to a cleaner and safer environment for everyone
              </li>
              <li>
                Connecting with community members who share your passion for the
                environment
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              What you&apos;ll gain:
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-base">
              <li>
                The satisfaction of making a tangible difference to the
                Australian environment
              </li>
              <li>An opportunity to enjoy the outdoors and be active</li>
              <li>
                A chance to meet new people and connect with your community
              </li>
              <li>
                The rewarding feeling of contributing to a cleaner, healthier
                Australia
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-base font-semibold mb-1">
              No prior experience is needed!
            </h3>
            <p className="text-sm">
              All you need is a willingness to help and a passion for a cleaner
              Australia. We provide the necessary equipment like bags and
              gloves.
            </p>
          </div>

          <div className="flex gap-1 items-center mt-6">
            <Button
              className={`${
                appliedEvents.includes("2")
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }   h-8 px-5 font-normal text-sm text-white`}
              onClick={handleApplyClick}
              disabled={appliedEvents.includes("2")}
            >
              {appliedEvents.includes("2") ? "Applied" : "Apply Now"}
            </Button>
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          opportunityDetails={getOpportunityDetails(opportunityId)}
        />
      </div>
    );
  }

  if (opportunityId === "3") {
    return (
      <div className="flex-1 max-w-3xl">
        <div className="w-full h-[200px] relative mb-6">
          <Image
            src="/clean1.svg"
            alt="Clean Up Volunteer Banner"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4">Clean Up Volunteer</h1>

        <div className="text-sm text-gray-600 mb-3">
          Posted by
          <Link href="/volunteer/organizer/clean-up-australia">
            <span className="text-blue-600 hover:underline cursor-pointer">
              {" "}
              Clean Up Australia
            </span>
          </Link>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-4">
          <p className="text-base leading-relaxed">
            Want to help protect Australia&apos;s parks, beaches, and waterways
            from litter and waste? Clean Up Australia is looking for
            enthusiastic volunteers to help clean up general waste from our
            parks, beaches, and other public spaces.
          </p>

          <p className="text-base leading-relaxed">
            As a volunteer, you&apos;ll join a nationwide movement of people
            dedicated to keeping Australia clean and healthy. You&apos;ll work
            together to remove litter, protect our natural environment, and make
            a positive impact on your local community.
          </p>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              What you&apos;ll be doing:
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-base">
              <li>
                Participating in clean-up events at various public locations
              </li>
              <li>Collecting and bagging general waste and litter</li>
              <li>
                Helping to keep our parks, beaches, bushlands, and waterways
                tidy
              </li>
              <li>
                Contributing to a cleaner and safer environment for everyone
              </li>
              <li>
                Connecting with community members who share your passion for the
                environment
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              What you&apos;ll gain:
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-base">
              <li>
                The satisfaction of making a tangible difference to the
                Australian environment
              </li>
              <li>An opportunity to enjoy the outdoors and be active</li>
              <li>
                A chance to meet new people and connect with your community
              </li>
              <li>
                The rewarding feeling of contributing to a cleaner, healthier
                Australia
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-base font-semibold mb-1">
              No prior experience is needed!
            </h3>
            <p className="text-sm">
              All you need is a willingness to help and a passion for a cleaner
              Australia. We provide the necessary equipment like bags and
              gloves.
            </p>
          </div>

          <div className="flex gap-1 items-center mt-6">
            <Button
              className={`${
                appliedEvents.includes("3")
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }   h-8 px-5 font-normal text-sm text-white`}
              onClick={handleApplyClick}
              disabled={appliedEvents.includes("3")}
            >
              {appliedEvents.includes("3") ? "Applied" : "Apply Now"}
            </Button>
            <Button variant="ghost" size="icon" className="text-yellow-400 h-8 pointer-events-none">
              <Star className="h-5 w-5 fill-current" />
            </Button>
          </div>
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          opportunityDetails={getOpportunityDetails(opportunityId)}
        />
      </div>
    );
  }

  if (opportunityId === "4") {
    return (
      <div className="flex-1 max-w-3xl">
        <div className="w-full h-[200px] relative mb-6">
          <Image
            src="/garden.svg"
            alt="Gardening Volunteer Banner"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4">Gardening Volunteer</h1>

        <div className="text-sm text-gray-600 mb-3">
          Posted by
          <Link href="/volunteer/organizer/easy-care-gardening">
            <span className="text-blue-600 hover:underline cursor-pointer">
              {" "}
              Easy Care Gardening
            </span>
          </Link>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-4">
          <p className="text-base leading-relaxed">
            Do you have a passion for gardening and a desire to make a real
            difference in your community? We are looking for enthusiastic and
            friendly volunteers to help senior Australians maintain their gardens
            and stay in the homes they love.
          </p>

          <p className="text-base leading-relaxed">
            As a volunteer gardener, you&apos;ll work in a team to provide
            essential gardening services such as weeding, pruning, and mulching.
            Your efforts will directly contribute to creating safe and tidy
            outdoor spaces for elderly individuals, helping them to live
            independently for longer.
          </p>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              <u>What you&apos;ll be doing:</u>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-base">
              <li>Working in small teams to tidy up gardens</li>
              <li>Weeding garden beds and pathways</li>
              <li>Pruning shrubs and small trees</li>
              <li>Spreading mulch to improve soil health and presentation</li>
              <li>
                Creating a safer and more enjoyable outdoor environment for
                seniors
              </li>
              <li>Building meaningful connections with the elderly community</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              <u>What you&apos;ll gain:</u>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-base">
              <li>
                The satisfaction of making a difference in the lives of senior
                Australians
              </li>
              <li>
                The opportunity to connect with and learn from the elderly
                community
              </li>
              <li>
                A chance to contribute to your local community in a meaningful way
              </li>
              <li>
                The enjoyment of working outdoors and sharing your gardening
                skills
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-base font-semibold mb-1">
              No prior professional gardening experience is necessary!
            </h3>
            <p className="text-sm">
              We welcome anyone with a willingness to help and a positive
              attitude.
            </p>
          </div>

          <div className="flex gap-1 items-center mt-6">
            <Button
              className={`${
                appliedEvents.includes("4")
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }  h-8 px-5 font-normal text-sm text-white`}
              onClick={handleApplyClick}
              disabled={appliedEvents.includes("4")}
            >
              {appliedEvents.includes("4") ? "Applied" : "Apply Now"}
            </Button>
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          opportunityDetails={getOpportunityDetails(opportunityId)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-3xl">
      <div className="w-full h-[200px] relative mb-6">
        <Image
          src="/garden.svg"
          alt="Gardening Volunteer Banner"
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">Gardening Volunteer</h1>

      <div className="text-sm text-gray-600 mb-3">
        Posted by
        <Link href="/volunteer/organizer/easy-care-gardening">
          <span className="text-blue-600 hover:underline cursor-pointer">
            {" "}
            Easy Care Gardening
          </span>
        </Link>
      </div>

      <div className="prose max-w-none text-gray-700 space-y-4">
        <p className="text-base leading-relaxed">
          Do you have a passion for gardening and a desire to make a real
          difference in your community? We are looking for enthusiastic and
          friendly volunteers to help senior Australians maintain their gardens
          and stay in the homes they love.
        </p>

        <p className="text-base leading-relaxed">
          As a volunteer gardener, you&apos;ll work in a team to provide
          essential gardening services such as weeding, pruning, and mulching.
          Your efforts will directly contribute to creating safe and tidy
          outdoor spaces for elderly individuals, helping them to live
          independently for longer.
        </p>

        <div>
          <h2 className="text-lg font-semibold mb-2">
            <u>What you&apos;ll be doing:</u>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-base">
            <li>Working in small teams to tidy up gardens</li>
            <li>Weeding garden beds and pathways</li>
            <li>Pruning shrubs and small trees</li>
            <li>Spreading mulch to improve soil health and presentation</li>
            <li>
              Creating a safer and more enjoyable outdoor environment for
              seniors
            </li>
            <li>Building meaningful connections with the elderly community</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">
            <u>What you&apos;ll gain:</u>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-base">
            <li>
              The satisfaction of making a difference in the lives of senior
              Australians
            </li>
            <li>
              The opportunity to connect with and learn from the elderly
              community
            </li>
            <li>
              A chance to contribute to your local community in a meaningful way
            </li>
            <li>
              The enjoyment of working outdoors and sharing your gardening
              skills
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-base font-semibold mb-1">
            No prior professional gardening experience is necessary!
          </h3>
          <p className="text-sm">
            We welcome anyone with a willingness to help and a positive
            attitude.
          </p>
        </div>

        <div className="flex gap-1 items-center mt-6">
          <Button
            className={`${
              appliedEvents.includes("1")
                ? "bg-green-600 hover:bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }  h-8 px-5 font-normal text-sm text-white`}
            onClick={handleApplyClick}
            disabled={appliedEvents.includes("1")}
          >
            {appliedEvents.includes("1") ? "Applied" : "Apply Now"}
          </Button>
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          opportunityDetails={getOpportunityDetails(opportunityId)}
        />
      </div>
    </div>
  );
}
