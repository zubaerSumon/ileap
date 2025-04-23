"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecurrenceModal({
  isOpen,
  onClose,
}: RecurrenceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[800px] overflow-y-auto">
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold mb-4">Recurrence type</h2>
        </div>

        <div className="space-y-6 px-6 pb-6">
          {/* Recurrence Type */}
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Select the pattern that suits your event
            </p>
            <RadioGroup defaultValue="weekly" className="grid grid-cols-4 gap-4">
              {["daily", "weekly", "monthly", "yearly"].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Recur Days */}
          <div>
            <p className="text-sm mb-4">Recur days that you select</p>
            <RadioGroup defaultValue="tue" className="grid grid-cols-7 gap-4">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <RadioGroupItem value={day} id={day} />
                  <Label htmlFor={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Recurrence Date & Time */}
          <div>
            <h3 className="text-lg font-medium mb-4">Recurrence date & time</h3>
            <p className="text-sm text-gray-500 mb-4">
              To help avoid surprises, please be specific. e.g. a few hours every day. AusLEAP Australia recommends no more than 15 hours per week.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <Label>Date</Label>
                  <div className="flex items-center gap-2 mt-1 border rounded-md p-2">
                    <Input 
                      type="date" 
                      className="w-[150px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                      defaultValue="2025-01-07" 
                    />
                    <span>-</span>
                    <Input 
                      type="date" 
                      className="w-[150px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                      defaultValue="2025-01-17" 
                    />
                  </div>
                </div>
                <div>
                  <Label>Time</Label>
                  <div className="flex items-center gap-2 mt-1 border rounded-md p-2">
                    <Input 
                      type="time" 
                      className="w-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                      defaultValue="16:00" 
                    />
                    <span>-</span>
                    <Input 
                      type="time" 
                      className="w-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                      defaultValue="17:30" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="radio" id="endAfter" name="endType" />
                  <Label htmlFor="endAfter">End after</Label>
                </div>
                <Input type="number" placeholder="10" className="w-[80px]" />
                <span>Occurrences</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-medium mb-4">Location</h3>
            <p className="text-sm text-gray-500 mb-4">
              Where does the volunteer need to work from? Be specific, but flexible if you can. Does the work need to be done in person (at a physical location) or could it be done online or remotely?
            </p>
            <Input placeholder="21 Darling Dr, Sydney, Australia" className="w-full" />
          </div>

          {/* Number of Volunteers */}
          <div>
            <h3 className="text-lg font-medium mb-4">Number of volunteers for this slot</h3>
            <p className="text-sm text-gray-500 mb-4">
              Which category best represents this opportunity? Volunteers use this to help find opportunities they are interested in supporting.
            </p>
            <Input type="number" placeholder="20" className="w-[120px]" />
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
