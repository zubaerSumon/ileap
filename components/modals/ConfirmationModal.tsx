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
  const logoSrc = "/ausleap.svg";
  const utils = trpc.useUtils();

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
      <DialogContent className="w-full sm:w-[700px] min-h-[400px] sm:h-[600px] rounded-lg sm:rounded-[123px] bg-white pb-8 flex flex-col items-center px-4 sm:px-6">
        <DialogHeader className="flex flex-col items-center w-full mb-4 sm:mb-6">
          <DialogTitle className="sr-only">Volunteer Opportunity</DialogTitle>
          <Image
            src={logoSrc}
            alt={opportunityDetails.organization}
            width={150}
            height={50}
            className="mb-2 sm:mb-4 rounded-lg"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Let&apos;s confirm some details...
          </h2>
        </DialogHeader>

        <div className="flex-1 flex flex-col justify-between w-full max-w-[400px]">
          <div className="flex flex-col items-center">
            <p className="text-center mb-4 sm:mb-8 text-sm sm:text-base text-gray-600">
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
                  opportunityDetails.id === "2"
                    ? "clean-up-australia"
                    : "easy-care-gardening"
                }`}
                className="text-blue-600 font-semibold"
              >
                {opportunityDetails.organization}
              </Link>
            </p>

            <div className="space-y-4 sm:space-y-2 w-full px-2 sm:px-0">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <strong className="block text-gray-900">Date</strong>
                  <span>{opportunityDetails.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <strong className="block text-gray-900">Time</strong>
                  <span>{opportunityDetails.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <strong className="block text-gray-900">Location</strong>
                  <span>{opportunityDetails.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pb-0 sm:pb-8">
            <p className="mb-4 text-gray-600">
              Please click the button below to secure your volunteer role
            </p>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-[300px] h-10"
              onClick={() => {
                applyToEventMutation.mutate({ eventId: opportunityDetails.id });
              }}
              disabled={applyToEventMutation.isPending}
            >
              {applyToEventMutation.isPending ? "Applying..." : "Count me in!!"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
