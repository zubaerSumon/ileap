"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import toast from "react-hot-toast";

interface Volunteer {
  _id: string;
  name: string;
  avatar?: string;
  role: string;
  volunteer_profile?: {
    student_type?: "yes" | "no";
    course?: string;
    availability_date?: {
      start_date?: string;
      end_date?: string;
    };
    interested_on?: string[];
    bio?: string;
  };
}

export default function OrganizationHomepage() {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all available volunteers
  const { data: volunteers, isLoading } =
    trpc.users.getAvailableUsers.useQuery();

  // Debug logs
  console.log("Volunteers data:", volunteers);
  console.log("Is loading:", isLoading);

  // Get the send message mutation
  const sendMessageMutation = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setIsMessageModalOpen(false);
      setMessage("");

      setSelectedVolunteer(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  const handleSendMessage = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsMessageModalOpen(true);
  };

  const handleSubmitMessage = () => {
    if (!selectedVolunteer) return;

    // Send the message using the mutation
    sendMessageMutation.mutate({
      receiverId: selectedVolunteer._id,
      content: message,
    });
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Available Volunteers
      </h1>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading volunteers...</p>
          </div>
        ) : volunteers?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              No volunteers available at the moment.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {volunteers?.map((volunteer) => (
              <Card
                key={volunteer._id}
                className="hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden w-full py-0 cursor-pointer relative bg-white"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src="/avatar.svg"
                          alt="Volunteer Avatar"
                          width={48}
                          height={48}
                          className="rounded-full bg-gray-100"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          ✓ Available
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {volunteer.name}
                    </h3>

                    <div className="flex items-center gap-3 mb-3 text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 text-sm">📍</span>
                        <span className="text-sm">Sydney, Australia</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">🏆</span>
                        <span className="text-sm">10 projects</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {volunteer.volunteer_profile?.interested_on?.map((interest: string, index: number) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {interest.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>

                    {volunteer.volunteer_profile?.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {volunteer.volunteer_profile.bio}
                      </p>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-1 text-sm h-9 border-gray-200"
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 text-sm h-9"
                        onClick={() => handleSendMessage(volunteer)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Message {selectedVolunteer?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full"
              />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmitMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
