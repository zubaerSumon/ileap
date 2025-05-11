"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import RecurrenceModal from "./RecurrenceModal";

export default function ScheduleRecurrence() {
  const router = useRouter();
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <RecurrenceModal
        isOpen={isRecurrenceModalOpen}
        onClose={() => setIsRecurrenceModalOpen(false)}
      />
      <div className="container mx-auto py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold mb-6 pb-2">Schedule & Recurrence</h1>
        <h1 className="text-[14px] pb-12 font-normal">
          Fill out the information below so AusLEAP can find you volunteers for
          your organisation.
        </h1>
        <div className="bg-white rounded-lg relative">
          <div className="absolute top-6 left-6 text-sm text-blue-600 font-medium">
            Step 2 of 2
          </div>
          <button
            onClick={() => setIsRecurrenceModalOpen(true)}
            className="absolute top-6 right-6 text-sm text-blue-600 font-medium hover:text-blue-700 rounded-[6px] border border-[#2563EB] bg-[#ECF5FD] flex w-[131.5px] h-[33px] px-3 py-[6px] justify-center items-center gap-[6px]"
          >
            Make recurring
          </button>
          <div className="pt-16 px-6 pb-6">
            <div className="space-y-8">
              {/* Commitment type */}
              <div>
                <h2 className="text-lg font-medium mb-1 flex items-center">
                  Commitment type
                  <span className="text-red-500 ml-1">*</span>
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  How much time does the volunteer need to commit to? Volunteers
                  use this to help find suitable opportunities.
                </p>

                <RadioGroup defaultValue="regular" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oneoff" id="oneoff" />
                    <Label htmlFor="oneoff">One off</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Regular</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-lg font-medium mb-1 flex items-center">
                  Location
                  <span className="text-red-500 ml-1">*</span>
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Where does the volunteer need to work from? Be specific, but
                  flexible if you can. Does the work need to be done in person
                  (at a physical location) or could it be done online or
                  remotely? You can select up to 8 locations and only one state
                  or territory.
                </p>
                <Input
                  placeholder="21 Darling Dr, Sydney, Australia"
                  className="w-[382px]"
                />
              </div>

              {/* Number of volunteers */}
              <div>
                <h2 className="text-lg font-medium mb-1 flex items-center">
                  Number of volunteers
                  <span className="text-red-500 ml-1">*</span>
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Which category best represents this opportunity? Volunteers
                  use this to help find opportunities they are interested in
                  supporting.
                </p>
                <Input type="number" placeholder="20" className="w-[382px]" />
              </div>

              {/* Select date & time */}
              <div>
                <h2 className="text-lg font-medium mb-1 flex items-center">
                  Select date & time
                  <span className="text-red-500 ml-1">*</span>
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  To help avoid surprises, please be specific. e.g. a few hours
                  every day. AusLEAP Australia recommends no more than 15 hours
                  per week.
                </p>
                <div className="flex gap-4">
                  <div>
                    <Label>Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="date"
                        className="w-[150px]"
                        defaultValue="2025-01-07"
                      />
                      <span>-</span>
                      <Input
                        type="date"
                        className="w-[150px]"
                        defaultValue="2025-01-17"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Time</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="time"
                        className="w-[120px]"
                        defaultValue="16:00"
                      />
                      <span>-</span>
                      <Input
                        type="time"
                        className="w-[120px]"
                        defaultValue="17:30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Add your email/contact */}
              <div>
                <h2 className="text-lg font-medium mb-1 flex items-center">
                  Add your email/contact
                  <span className="text-gray-400 text-sm ml-2">(optional)</span>
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Which email address should we send applications to?
                </p>
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="arif@spotify.com"
                    className="w-[382px]"
                  />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      You can enter your own internal reference number here to
                      help keep track of it.
                    </p>
                    <Input
                      type="tel"
                      placeholder="+61 1243 5978"
                      className="w-[382px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
