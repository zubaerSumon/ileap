import { format } from "date-fns";
import { MessageCircle } from "lucide-react";

interface ActiveContractCardProps {
  avatar: string;
  jobTitle: string;
  freelancerName: string;
  startedAt: string;
  onFundMilestone: () => void;
  onMessage: () => void;
}

const ActiveContractCard = ({
  avatar,
  jobTitle,
  freelancerName,
  startedAt,
  onFundMilestone,
  onMessage,
}: ActiveContractCardProps) => {
  return (
    <div className="bg-white border-b border-gray-200 flex flex-row items-center justify-between px-6 h-24 last:border-b-0">
      <div className="flex items-center gap-4 min-w-0 h-full w-1/3">
        <img
          src={avatar}
          alt={freelancerName}
          className="h-12 w-12 rounded-full object-cover border border-gray-200"
        />
        <div className="min-w-0">
          <div className="font-semibold text-base truncate">{jobTitle}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground truncate">{freelancerName}</span>
            <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">Active contract</span>
            <span className="text-xs text-muted-foreground">Started {startedAt ? format(new Date(startedAt), "MMM d") : "-"}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-row items-center justify-end gap-4 min-w-0 h-full">
        <div className="flex-1 text-sm text-muted-foreground truncate text-right">Fund a new milestone for {freelancerName} to keep working</div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-2 transition-colors whitespace-nowrap active:scale-95 text-sm" title="Fund & activate milestone" onClick={onFundMilestone}>Fund & activate milestone</button>
        <button className="flex items-center gap-1 border border-gray-300 rounded px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors" title="Message" onClick={onMessage}><MessageCircle className="h-4 w-4" /></button>
      </div>
    </div>
  );
};

export default ActiveContractCard; 