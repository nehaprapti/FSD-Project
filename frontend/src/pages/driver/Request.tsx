import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const DriverRequest: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setDismissed(true); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (dismissed) {
      const t = setTimeout(() => navigate("/driver/dashboard"), 500);
      return () => clearTimeout(t);
    }
  }, [dismissed, navigate]);

  const circumference = 2 * Math.PI * 20;
  const dashOffset = circumference * (1 - timeLeft / 15);

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal card */}
      <div className={`relative w-full bg-carbon-card rounded-sheet p-6 transition-transform duration-300 ${dismissed ? "translate-y-full" : "translate-y-0"}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-y-primary animate-pulse" />
            <h2 className="text-white text-lg font-bold">New Ride Request</h2>
          </div>
          {/* Countdown timer */}
          <div className="relative w-11 h-11">
            <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" fill="none" stroke="#333" strokeWidth="2" />
              <circle cx="22" cy="22" r="20" fill="none" stroke="#F5C400" strokeWidth="2" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{timeLeft}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Car size={20} className="text-y-primary flex-shrink-0" />
            <span className="text-white font-bold">1.2 km away</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-success flex-shrink-0 ml-1" />
            <span className="text-white text-sm">42, Gandhi Street, T. Nagar, Chennai</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-danger flex-shrink-0 ml-1" />
            <span className="text-white text-sm">15, Anna Salai, Anna Nagar, Chennai</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-metric text-green-success text-[22px]">₹220 – ₹260</p>
            <span className="bg-carbon-border text-rx-gray-400 text-xs font-medium rounded-pill px-3 py-1">Economy</span>
          </div>

          <p className="text-rx-gray-400 text-[13px]">8.4 km · ~22 min</p>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-y-primary fill-y-primary" />
            <span className="text-y-primary text-[13px]">4.6 passenger rating</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="dark" className="w-[45%]" onClick={() => navigate("/driver/dashboard")}>
            Decline
          </Button>
          <Button className="w-[55%]" onClick={() => navigate("/driver/trip/1")}>
            Accept Ride
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverRequest;
