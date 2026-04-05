import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Star, MessageSquare, Phone } from "lucide-react";
import MapContainer from "@/components/shared/MapContainer";
import { Button } from "@/components/ui/button";

const SearchingDriver: React.FC = () => {
  const navigate = useNavigate();
  const [found, setFound] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFound(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapContainer className="absolute inset-0">
        {/* Animated car icons */}
        {[
          { top: "35%", left: "30%", delay: "0s" },
          { top: "45%", left: "55%", delay: "0.3s" },
          { top: "40%", left: "70%", delay: "0.6s" },
          { top: "50%", left: "40%", delay: "0.9s" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{ top: pos.top, left: pos.left, animationDelay: pos.delay, animationDuration: "2s" }}
          >
            <Car size={20} className="text-y-primary" />
          </div>
        ))}
        {/* Pickup pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-green-success border-2 border-white shadow-lg" />
        </div>
      </MapContainer>

      {/* Overlay card */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-white rounded-modal p-6 max-w-[340px] w-[90%] shadow-card text-center">
          {!found ? (
            <>
              {/* Pulsing taxi */}
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-y-primary/30 animate-pulse-ring" />
                <div className="absolute inset-2 rounded-full bg-y-primary flex items-center justify-center">
                  <Car size={24} className="text-y-dark" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-rx-black">Finding your driver...</h2>
              <p className="text-rx-gray-400 text-[13px] mt-1 mb-4">This usually takes under 30 seconds</p>
              {/* Progress bar */}
              <div className="h-1 bg-rx-gray-100 rounded-pill overflow-hidden">
                <div className="h-full w-1/3 bg-y-primary rounded-pill animate-indeterminate" />
              </div>
              <button onClick={() => navigate("/passenger/home")} className="text-red-danger text-[13px] font-medium mt-4">
                Cancel Ride
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-y-primary border-[3px] border-y-primary mx-auto mb-3 flex items-center justify-center text-y-dark font-bold text-lg">
                R
              </div>
              <h2 className="text-lg font-bold text-rx-black">Ravi Kumar</h2>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= 4 ? "fill-y-primary text-y-primary" : "text-rx-gray-100"} />
                ))}
                <span className="text-sm font-bold text-rx-black ml-1">4.8</span>
              </div>
              <p className="text-rx-gray-400 text-sm mt-2">White Swift Dzire · TN 09 AB 1234</p>
              <span className="inline-block mt-3 bg-y-primary text-y-dark text-sm font-semibold rounded-pill px-4 py-1.5">
                Arriving in 4 min
              </span>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1 gap-2" size="sm">
                  <MessageSquare size={16} /> Message
                </Button>
                <Button variant="outline-gray" className="flex-1 gap-2" size="sm">
                  <Phone size={16} /> Call
                </Button>
              </div>
              <Button className="w-full mt-3" onClick={() => navigate("/passenger/ride/1")}>
                Track Driver
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchingDriver;
