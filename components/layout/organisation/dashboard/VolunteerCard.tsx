import { Button } from "@/components/ui/button";

interface VolunteerCardProps {
  avatar: string;
  name: string;
  country: string;
  jobs: number;
  rate: string;
  lastContract: string;
  onRehire: () => void;
}

const VolunteerCard = ({
  avatar,
  name,
  country,
  jobs,
  rate,
  lastContract,
  onRehire,
}: VolunteerCardProps) => {
  return (
    <div className="min-w-[284px] max-w-[284px] flex flex-col items-center p-6   bg-white border border-gray-200 rounded-xl group cursor-pointer">
      <img src={avatar} alt={name} className="h-16 w-16 rounded-full mb-4 object-cover border border-gray-200 group-hover:border-blue-400 transition" />
      <div className="font-medium text-center text-lg mb-1">{name}</div>
      <div className="text-sm text-muted-foreground text-center mb-2">{country}</div>
      <div className="flex justify-center gap-3 text-sm mb-2">
        <span>{jobs} Jobs</span>
        <span className="text-muted-foreground">{rate} Rate</span>
      </div>
      <div className="text-sm text-muted-foreground text-center mb-3">
        Last contract together:<br />
        <span className="font-semibold text-black">{lastContract}</span>
      </div>
      <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors" onClick={onRehire}>Rehire</Button>
    </div>
  );
};

export default VolunteerCard; 