import React from "react";
import { cn } from "@/lib/utils";

interface EarningsCardProps {
  label: string;
  amount: string;
  stats?: { label: string; value: string }[];
  progress?: number;
  dark?: boolean;
  className?: string;
}

const EarningsCard: React.FC<EarningsCardProps> = ({ label, amount, stats, progress, dark = true, className }) => {
  return (
    <div className={cn("rounded-card p-5", dark ? "bg-carbon-card" : "bg-white shadow-card", className)}>
      <p className="text-label text-rx-gray-400">{label}</p>
      <p className="text-metric text-green-success text-[42px] mt-1">{amount}</p>
      {stats && (
        <div className="flex items-center gap-1 mt-3 text-[13px]">
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <span className={dark ? "text-rx-gray-400" : "text-rx-gray-400"}>·</span>}
              <span className={dark ? "text-white" : "text-rx-black"}>{s.value} {s.label}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-carbon-border rounded-pill overflow-hidden">
          <div className="h-full bg-y-primary rounded-pill transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};

export default EarningsCard;
