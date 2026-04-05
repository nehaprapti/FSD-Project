import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Crown, Users, Flame, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusPill from "@/components/shared/StatusPill";

const rides = [
  { type: "economy", name: "Economy", icon: Car, fare: "₹149", seats: "4 seats", eta: "3 min" },
  { type: "premium", name: "Premium", icon: Crown, fare: "₹249", seats: "4 seats", eta: "5 min" },
  { type: "shared", name: "Shared", icon: Users, fare: "₹89", seats: "2 seats", eta: "4 min" },
];

const FareEstimate: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const surgeMultiplier = 1.4;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => navigate(-1)}><ArrowLeft size={20} className="text-rx-black" /></button>
        <h1 className="flex-1 text-center text-lg font-semibold text-rx-black">Your Ride Summary</h1>
        <div className="w-5" />
      </div>

      <div className="px-5">
        {/* Route card */}
        <div className="bg-white rounded-card shadow-card p-4 mb-5">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 rounded-full bg-green-success" />
              <div className="w-px h-8 border-l border-dashed border-rx-gray-400" />
              <div className="w-3 h-3 rounded-full bg-y-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-rx-black text-sm">T. Nagar, Chennai</p>
              <div className="h-6" />
              <p className="font-bold text-rx-black text-sm">Anna Nagar, Chennai</p>
            </div>
          </div>
          <p className="text-label text-rx-gray-400 mt-3">3.4 km · ~12 mins</p>
        </div>

        {/* Surge indicator */}
        {surgeMultiplier > 1 && (
          <div className="flex items-center gap-2 bg-y-surface rounded-pill px-4 py-2 mb-4 w-fit">
            <Flame size={16} className="text-y-primary" />
            <span className="text-y-text text-sm font-semibold">{surgeMultiplier}x Surge</span>
          </div>
        )}

        {/* Ride options */}
        <div className="space-y-3 mb-5">
          {rides.map((ride, i) => (
            <button
              key={ride.type}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-3 p-4 rounded-[14px] border transition-all text-left ${
                i === selected ? "border-l-[3px] border-y-primary bg-y-surface" : "border-rx-gray-100 bg-white"
              }`}
            >
              <ride.icon size={40} className="text-rx-gray-700 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-[15px] text-rx-black">{ride.name}</p>
                <p className="text-label text-rx-gray-400">{ride.seats}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-rx-black">{ride.fare}</p>
                <span className="bg-y-surface text-y-text text-[11px] font-semibold rounded-pill px-2.5 py-0.5">{ride.eta}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Fare breakdown */}
        <button onClick={() => setShowBreakdown(!showBreakdown)} className="flex items-center gap-2 text-sm text-rx-gray-700 mb-2">
          Fare breakdown {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showBreakdown && (
          <div className="bg-off-white rounded-card p-4 mb-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-rx-gray-700">Base fare</span><span className="text-rx-black">₹40</span></div>
            <div className="flex justify-between"><span className="text-rx-gray-700">Distance (3.4 km)</span><span className="text-rx-black">₹68</span></div>
            <div className="flex justify-between"><span className="text-rx-gray-700">Surge (1.4x)</span><span className="text-y-text font-semibold">₹41</span></div>
            <div className="border-t border-rx-gray-100 pt-2 flex justify-between">
              <span className="font-bold text-rx-black">Total</span>
              <span className="text-metric text-green-success text-lg">₹149</span>
            </div>
          </div>
        )}

        <Button className="w-full" onClick={() => navigate("/passenger/searching")}>Book Now</Button>
        <p className="text-center text-rx-gray-400 text-xs mt-3 pb-8">Cancellation is free within 2 min</p>
      </div>
    </div>
  );
};

export default FareEstimate;
