import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock, Check } from "lucide-react";
import MapContainer from "@/components/shared/MapContainer";
import BottomSheet from "@/components/shared/BottomSheet";
import { Button } from "@/components/ui/button";

const SharedRide: React.FC = () => {
  const navigate = useNavigate();
  const [matched, setMatched] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setTimeout(() => setMatched(true), 3000);
    const interval = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapContainer className="absolute inset-0 h-[55%]" />

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <BottomSheet>
          <div className="bg-white rounded-[14px] border-2 border-y-primary p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-y-primary" />
                <span className="font-bold text-rx-black">Shared Ride</span>
              </div>
              <span className="bg-green-success/15 text-green-dark text-[11px] font-bold rounded-pill px-2.5 py-0.5">POPULAR</span>
            </div>
            <p className="text-green-success font-bold text-sm">Share & Save up to 35%</p>
            <p className="text-rx-black text-sm mt-1">
              <span className="line-through text-rx-gray-400">₹149</span> ₹80 – ₹110 per person
            </p>

            {/* Seat icons */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-1">
                {[1,2,3,4].map(s => (
                  <div key={s} className={`w-6 h-6 rounded ${s <= 2 ? "bg-rx-gray-400" : "border-2 border-y-primary bg-transparent"}`} />
                ))}
              </div>
              <span className="text-rx-gray-400 text-xs">2 seats left</span>
            </div>
          </div>

          {matched ? (
            <div className="bg-off-white rounded-card p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rx-gray-100 flex items-center justify-center">
                  <Users size={18} className="text-rx-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-rx-black text-sm">1 co-passenger matched</p>
                  <p className="text-green-success text-sm font-bold mt-0.5">Your fare: ₹94</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={12} className="text-rx-gray-400" />
                    <span className="text-rx-gray-400 text-xs">Route adds ~4 mins</span>
                  </div>
                </div>
                <Check size={20} className="text-green-success" />
              </div>
            </div>
          ) : (
            <div className="bg-off-white rounded-card p-4 mb-4 text-center">
              <p className="text-rx-gray-700 text-sm">Looking for co-passengers... {countdown}s</p>
              <div className="h-1 bg-rx-gray-100 rounded-pill mt-2 overflow-hidden">
                <div className="h-full bg-y-primary rounded-pill animate-indeterminate" />
              </div>
            </div>
          )}

          <Button className="w-full" onClick={() => navigate("/passenger/searching")}>
            {matched ? "Confirm Shared Ride" : "Waiting for match..."}
          </Button>
        </BottomSheet>
      </div>
    </div>
  );
};

export default SharedRide;
