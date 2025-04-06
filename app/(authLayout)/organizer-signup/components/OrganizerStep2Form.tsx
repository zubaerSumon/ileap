import { UseFormRegister, FieldErrors } from "react-hook-form";
import { OrganizerSignupForm } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
 
interface OrganizerStep2FormProps {
  register: UseFormRegister<OrganizerSignupForm>;
  errors: FieldErrors<OrganizerSignupForm>;
}

export function OrganizerStep2Form({
  register,
  errors,
}: OrganizerStep2FormProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input
          id="organizationName"
          type="text"
          {...register("organizationName")}
          className="mt-1"
        />
        {errors.organizationName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.organizationName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="organizationDescription">Organization Description</Label>
        <Textarea
          id="organizationDescription"
          {...register("organizationDescription")}
          className="mt-1"
          rows={4}
        />
        {errors.organizationDescription && (
          <p className="mt-1 text-sm text-red-600">
            {errors.organizationDescription.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          {...register("website")}
          className="mt-1"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="organizationPhone">Phone Number (Optional)</Label>
        <Input
          id="organizationPhone"
          type="tel"
          {...register("organizationPhone")}
          className="mt-1"
        />
        {errors.organizationPhone && (
          <p className="mt-1 text-sm text-red-600">
            {errors.organizationPhone.message}
          </p>
        )}
      </div>
    </div>
  );
}