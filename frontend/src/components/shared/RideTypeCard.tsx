import React from "react";
import { cn } from "@/lib/utils";
import { Car, Crown, Users } from "lucide-react";

interface RideTypeCardProps {
  type: "economy" | "premium" | "shared";
  fare: string;
  eta: string;
  selected?: boolean;
  onClick?: () => void;
}

const icons = { economy: Car, premium: Crown, shared: Users };
const names = { economy: "Economy", premium: "Premium", shared: "Shared" };

const RideTypeCard: React.FC<RideTypeCardProps> = ({ type, fare, eta, selected, onClick }) => {
  const Icon = icons[type];
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-[140px] rounded-[14px] p-3.5 text-left transition-all border",
        selected
          ? "border-2 border-y-primary bg-y-surface"
          : "border-rx-gray-100 bg-white hover:border-y-primary/40"
      )}
    >
      <Icon size={24} className="text-y-primary mb-2" />
      <p className="font-bold text-rx-black text-sm">{names[type]}</p>
      <p className="text-rx-gray-700 text-sm font-medium mt-0.5">{fare}</p>
      <span className="inline-block mt-2 bg-y-surface text-y-text text-[11px] font-semibold rounded-pill px-2.5 py-0.5">
        {eta}
      </span>
    </button>
  );
};

export default RideTypeCard;
