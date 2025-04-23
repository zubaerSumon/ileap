import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { OrganizationSignupForm } from "@/types/auth";

interface OrganizationDetailedProfileStepProps {
  form: UseFormReturn<OrganizationSignupForm>;
  mediaConsent: boolean;
  setMediaConsent: (value: boolean) => void;
  mediaConsentError: string | null;
  setMediaConsentError: (value: string | null) => void;
}

export function OrganizationDetailedProfileStep({
  form,
  mediaConsent,
  setMediaConsent,
  mediaConsentError,
  setMediaConsentError,
}: OrganizationDetailedProfileStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Organization Details</h2>
        <p className="text-gray-600">Help us understand your organization better</p>
      </div>

      <FormField
        control={form.control}
        name="mission_statement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mission Statement</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your organization's mission"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="services_provided"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Services Provided</FormLabel>
            <FormControl>
              <Textarea
                placeholder="What services does your organization provide?"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="target_audience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Who does your organization serve?"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="referral_source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How did you hear about us?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="social_media">Social Media</SelectItem>
                <SelectItem value="search_engine">Search Engine</SelectItem>
                <SelectItem value="word_of_mouth">Word of Mouth</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("referral_source") === "other" && (
        <FormField
          control={form.control}
          name="referral_source_other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please specify</FormLabel>
              <FormControl>
                <Input placeholder="Tell us how you heard about us" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="space-y-4 pt-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="media_consent"
            checked={mediaConsent}
            onCheckedChange={(checked) => {
              setMediaConsent(checked as boolean);
              if (checked) setMediaConsentError(null);
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="media_consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Media Consent
            </label>
            <p className="text-sm text-gray-500">
              I consent to the use of my organization&apos;s information for promotional purposes.
            </p>
            {mediaConsentError && (
              <p className="text-sm text-red-500">{mediaConsentError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}