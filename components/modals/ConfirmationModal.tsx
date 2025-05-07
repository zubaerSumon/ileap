import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Calendar, Clock } from "lucide-react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import Link from "next/link";
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityDetails: {
    id: string;
    title: string;
    organization: string;
    date: string;
    time: string;
    location: string;
    logo: string;
  };
}

export function ConfirmationModal({
  isOpen,
  onClose,
  opportunityDetails,
}: ConfirmationModalProps) {
  const logoSrc = "/collab.svg";
  const utils = trpc.useUtils();
  const [isChecked, setIsChecked] = React.useState(false);

  const applyToEventMutation = trpc.users.applyToEvent.useMutation({
    onSuccess: (data) => {
      if (!data.alreadyApplied) {
        toast.success("You have successfully applied to this opportunity. ");
      }
      utils.users.profileCheckup.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to apply for this opportunity.");
    },
  });

  console.log({ opportunityDetails });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:w-[750px] min-h-[400px] sm:h-[660px] rounded-lg sm:rounded-[10px] bg-white pb-4 flex flex-col items-center sm:px-2 px-2">
        <DialogHeader className="flex flex-col items-center w-full mb-4">
          <DialogTitle className="sr-only">Volunteer Opportunity</DialogTitle>
          <Image
            src={logoSrc}
            alt={opportunityDetails.organization}
            width={150}
            height={52}
            className="mb-3 rounded-lg"
          />
          <h2 className="text-base sm:text-xl font-bold text-center">
            Let&apos;s confirm some details...
          </h2>
        </DialogHeader>

        <div className="flex-1 flex flex-col justify-between w-full max-w-[400px] py-6">
          <div className="flex flex-col items-center">
            <p className="text-center mb-4 text-sm sm:text-base text-gray-600 px-4">
              Here are the opportunity details for{" "}
              <Link
                href={`/volunteer/opportunities/${opportunityDetails.id}`}
                className="text-blue-600 font-semibold"
              >
                {opportunityDetails.title}
              </Link>{" "}
              with{" "}
              <Link
                href={`/volunteer/organizer/${
                  opportunityDetails.id === "2" || opportunityDetails.id === "3"
                    ? "clean-up-australia"
                    : "easy-care-gardening"
                }`}
                className="text-blue-600 font-semibold"
              >
                {opportunityDetails.organization}
              </Link>
            </p>

            <div className="space-y-3 w-full px-4 sm:px-0">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <strong className="block text-gray-900 text-sm">Date</strong>
                  <span className="text-sm">{opportunityDetails.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <strong className="block text-gray-900 text-sm">Time</strong>
                  <span className="text-sm">{opportunityDetails.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <strong className="block text-gray-900 text-sm">Location</strong>
                  <span className="text-sm">{opportunityDetails.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 px-4">
            <p className="text-sm sm:text-[14px] text-gray-600 break-words">
             Click the button below to secure your volunteer role
            </p>

            <p className="text-[#DA3131] text-sm sm:text-[14px] break-words mt-2">
              Please note: We have a 1-week cancellation policy
            </p>

            <div className="flex items-center justify-center gap-2 mt-4 mb-6">
              <input
                type="checkbox"
                id="understand-checkbox"
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="understand-checkbox" className="text-gray-600 text-sm">
                I understand
              </label>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-[250px] h-10 text-sm font-medium"
              onClick={() => {
                applyToEventMutation.mutate({ eventId: opportunityDetails.id });
              }}
              disabled={applyToEventMutation.isPending || !isChecked}
            >
              {applyToEventMutation.isPending ? "Applying..." : "Count me in!!"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
