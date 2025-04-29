"use client";

import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function BasicInformation() {
  const router = useRouter();
  const [] = useState<string[]>([]);
  const [] = useState<string[]>([]);

  return (
    <div className="container mx-auto py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </button>
      <h1 className="text-2xl font-bold mb-6 pb-2">Basic Information</h1>
      <h1 className="text-[14px] pb-12 font-normal">
        Fill out the information below so AusLEAP can find you volunteers for
        your organisation.
      </h1>
      <Card className="bg-white rounded-lg shadow-none border-0 relative" role="dialog" aria-labelledby="basic-info-title">
        <div className="absolute top-6 left-6 text-sm text-blue-600 font-medium">
          Step 1 of 2
        </div>
        <div className="pt-16 px-6 pb-6">
          <h2 id="basic-info-title" className="sr-only">Basic Information Form - Step 1</h2>
          <div className="space-y-8">
            {/* Opportunity title & description */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Opportunity title & description
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Ensure your role title is succinct and easily understood by the
                volunteer e.g. Retail Assistant, Marketing Support, Driver.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter opportunity title"
                    className="mt-1 w-[382px]"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <p className="text-[14px] text-gray-500 mb-2">
                    Here&apos;s your opportunity to say more. Include a detailed
                    outline of... <br />
                    <u>
                      key duties you need the volunteer to do, skills and
                      experience needed to do the role, organisational
                      background, confirm whether all potential volunteers are
                      required to complete a mandatory training or orientation
                      process before commencing their assigned role within your
                      organization.
                    </u>{" "}
                  </p>
                  <Textarea
                    id="description"
                    placeholder="Describe the opportunity"
                    className="min-h-[150px] mt-1 w-[382px]"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Category
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Which category best represents this opportunity? Volunteers use
                this to help find opportunities they are interested in
                supporting.
              </p>

              <Select>
                <SelectTrigger className="w-[382px]">
                  <SelectValue placeholder="2 items selected" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">
                    Education & Literacy
                  </SelectItem>
                  <SelectItem value="health">Health & Medicine</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="community">
                    Community Development
                  </SelectItem>
                  <SelectItem value="humanRights">Human Rights</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Required skills */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Required skills
                <span className="text-red-500 ml-1">*</span>
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Which skillset might match this opportunity? Volunteers use this
                to help find opportunities they are interested in supporting.
              </p>

              <Select>
                <SelectTrigger className="w-[382px]">
                  <SelectValue placeholder="2 items selected" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="teaching">Teaching</SelectItem>
                  <SelectItem value="language">Language Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Extra conditions/question if required */}
            <div>
              <h2 className="text-lg font-medium mb-1 flex items-center">
                Extra conditions/question if required
                <span className="text-gray-400 text-sm ml-2">(optional)</span>
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                Provide any extra question if needed to qualify the volunteer
                and also select which pattern of question suits most.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <Textarea
                    placeholder="Some special conditions for volunteering include:"
                    className="min-h-[50px] w-[382px]"
                  />

                  <div>
                    <div className="border rounded-md p-3">
                      <Label className="text-sm text-gray-500">
                        Answer type
                      </Label>
                      <Select>
                        <SelectTrigger className="w-[142px] border-0 p-0 mt-1 shadow-0">
                          <SelectValue placeholder="Checkbox" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                          <SelectItem value="multiple">
                            Multiple choice
                          </SelectItem>
                          <SelectItem value="paragraph">Paragraph</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Select answers</Label>
                  <div className="space-y-2 mt-2 w-[382px]">
                    <div className="flex items-start space-x-2 p-3 border rounded-md">
                      <div className="mt-1">1.</div>
                      <div className="flex-1 text-[12px]">
                        Volunteers should receive training that benefits them,
                        such as providing new knowledge or skills.
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 p-3 border rounded-md">
                      <div className="mt-1">2.</div>
                      <div className="flex-1 text-[12px]">
                        Some organizations may not cover volunteers under a
                        certain age or over a certain age with their insurance.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
