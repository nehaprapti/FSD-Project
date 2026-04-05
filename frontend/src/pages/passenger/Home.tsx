import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, Navigation } from "lucide-react";
import MapContainer from "@/components/shared/MapContainer";
import BottomSheet from "@/components/shared/BottomSheet";
import RideTypeCard from "@/components/shared/RideTypeCard";
import GeminiChatWidget from "@/components/shared/GeminiChatWidget";
import { Button } from "@/components/ui/button";

type RideType = "economy" | "premium" | "shared";

const PassengerHome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRide, setSelectedRide] = useState<RideType>("economy");
  const [pickup, setPickup] = useState("T. Nagar, Chennai");
  const [dropoff, setDropoff] = useState("");

  return (
    <div className="relative h-screen w-full overflow-hidden bg-off-white">
      {/* Map Background */}
      <MapContainer className="absolute inset-0 h-[60%]">
        {/* Pickup pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-green-success border-2 border-white shadow-lg" />
          <div className="w-0.5 h-6 bg-green-success mx-auto" />
        </div>
      </MapContainer>

      {/* Floating top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-y-primary flex items-center justify-center text-y-dark font-bold text-sm">A</div>
          <span className="text-white font-semibold text-base drop-shadow-lg">Good morning, Arjun</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-y-primary/20 backdrop-blur flex items-center justify-center">
          <Bell size={20} className="text-y-primary" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <BottomSheet>
          <h2 className="text-[22px] font-bold text-rx-black mb-4">Where to?</h2>

          {/* Inputs */}
          <div className="flex gap-3 mb-5">
            {/* Dots and line */}
            <div className="flex flex-col items-center pt-3 gap-0">
              <div className="w-3 h-3 rounded-full bg-green-success animate-pulse" />
              <div className="w-px h-8 border-l border-dashed border-rx-gray-400" />
              <div className="w-3 h-3 rounded-full bg-y-primary" />
            </div>

            <div className="flex-1 space-y-2">
              <input
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                placeholder="Current location"
                className="w-full h-12 bg-off-white rounded-input px-4 text-rx-black text-sm outline-none"
              />
              <input
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                placeholder="Drop-off location"
                className="w-full h-12 bg-off-white rounded-input px-4 text-rx-black text-sm outline-none"
              />
            </div>
          </div>

          {/* Ride type selector */}
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1">
            <RideTypeCard type="economy" fare="₹149" eta="3 min" selected={selectedRide === "economy"} onClick={() => setSelectedRide("economy")} />
            <RideTypeCard type="premium" fare="₹249" eta="5 min" selected={selectedRide === "premium"} onClick={() => setSelectedRide("premium")} />
            <RideTypeCard type="shared" fare="₹89" eta="4 min" selected={selectedRide === "shared"} onClick={() => setSelectedRide("shared")} />
          </div>

          <Button className="w-full" onClick={() => navigate("/passenger/estimate")}>
            Confirm Ride
          </Button>
        </BottomSheet>
      </div>

      <GeminiChatWidget />
    </div>
  );
};

export default PassengerHome;
