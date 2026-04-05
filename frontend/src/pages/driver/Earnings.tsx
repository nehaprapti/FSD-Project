import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import StatusPill from "@/components/shared/StatusPill";
import EarningsCard from "@/components/shared/EarningsCard";
import { Button } from "@/components/ui/button";

const periods = ["Today", "This Week", "Month"];

const trips = [
  { id: 1, day: "28", month: "Mar", pickup: "T. Nagar", drop: "Anna Nagar", time: "2:30 PM", earnings: "₹187", status: "paid" as const },
  { id: 2, day: "28", month: "Mar", pickup: "Besant Nagar", drop: "Adyar", time: "11:00 AM", earnings: "₹120", status: "paid" as const },
  { id: 3, day: "27", month: "Mar", pickup: "Central Stn", drop: "Guindy", time: "4:15 PM", earnings: "₹210", status: "pending" as const },
  { id: 4, day: "27", month: "Mar", pickup: "Marina", drop: "Mylapore", time: "9:30 AM", earnings: "₹95", status: "paid" as const },
  { id: 5, day: "26", month: "Mar", pickup: "Tambaram", drop: "Chromepet", time: "1:00 PM", earnings: "₹75", status: "pending" as const },
];

const DriverEarnings: React.FC = () => {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState("Today");

  return (
    <div className="min-h-screen bg-carbon pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft size={20} className="text-white" /></button>
          <h1 className="text-[22px] font-bold text-white">My Earnings</h1>
        </div>
      </div>

      {/* Period pills */}
      <div className="flex gap-2 px-5 mb-4">
        {periods.map(p => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`rounded-pill px-4 py-1.5 text-sm font-semibold transition-colors ${
              activePeriod === p ? "bg-y-primary text-y-dark" : "bg-carbon-border text-rx-gray-400"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Hero card */}
      <div className="px-5">
        <div className="bg-carbon-card rounded-modal p-6">
          <p className="text-label text-rx-gray-400">Total Earned</p>
          <p className="text-metric text-green-success text-5xl mt-1">₹8,420</p>
          <div className="flex gap-6 mt-4">
            {[
              { label: "Gross", value: "₹9,800", color: "text-white" },
              { label: "Commission", value: "-₹1,380", color: "text-red-danger" },
              { label: "Net", value: "₹8,420", color: "text-white" },
            ].map(s => (
              <div key={s.label}>
                <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
                <p className="text-label text-rx-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trip list */}
      <div className="px-5 mt-5 space-y-2">
        {trips.map(trip => (
          <div key={trip.id} className="bg-carbon-card rounded-[12px] p-3.5 flex items-center gap-3">
            <div className="w-10 text-center flex-shrink-0">
              <p className="text-y-primary font-bold text-base bg-carbon-border rounded px-1">{trip.day}</p>
              <p className="text-rx-gray-400 text-[10px]">{trip.month}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{trip.pickup} → {trip.drop}</p>
              <p className="text-rx-gray-400 text-xs">{trip.time}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-metric text-green-success font-bold">{trip.earnings}</p>
              <StatusPill status={trip.status} className="mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Payout card */}
      <div className="px-5 mt-5">
        <div className="bg-carbon-card rounded-card p-4">
          <p className="text-label text-rx-gray-400">Next Payout</p>
          <p className="text-metric text-green-success text-2xl mt-1">₹5,240</p>
          <p className="text-rx-gray-400 text-[13px] mt-1">Scheduled: Monday 10 AM</p>
          <Button variant="outline" className="w-full mt-3" size="sm">
            Request Early Payout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;
