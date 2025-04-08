import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  
  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 px-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-semibold">
          Emergency & Safety for earthquake affected area
        </h1>
      </div>
    </div>
  );
}