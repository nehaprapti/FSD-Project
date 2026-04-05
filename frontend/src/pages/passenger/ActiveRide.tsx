import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MessageSquare, Phone, AlertTriangle, ChevronUp } from "lucide-react";
import MapContainer from "@/components/shared/MapContainer";
import BottomSheet from "@/components/shared/BottomSheet";
import StatusPill from "@/components/shared/StatusPill";
import GeminiChatWidget from "@/components/shared/GeminiChatWidget";
import { Button } from "@/components/ui/button";

const statuses = ["driver-on-way", "driver-arrived", "trip-in-progress"] as const;
const stepLabels = ["Pickup", "In Transit", "Destination"];

const ActiveRide: React.FC = () => {
  const navigate = useNavigate();
  const [statusIdx, setStatusIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const status = statuses[statusIdx];

  const advanceStatus = () => {
    if (statusIdx < 2) setStatusIdx(statusIdx + 1);
    else navigate("/passenger/completed/1");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapContainer className="absolute inset-0">
        {/* Route polyline */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
          <polyline points="200,400 300,350 400,300 500,280 600,200" fill="none" stroke="#F5C400" strokeWidth="4" strokeLinecap="round" />
          <circle cx="200" cy="400" r="8" fill="#2ECC71" />
          <circle cx="600" cy="200" r="8" fill="#E74C3C" />
          {/* Moving car */}
          <circle cx={200 + statusIdx * 200} cy={400 - statusIdx * 70} r="10" fill="#F5C400" />
        </svg>
      </MapContainer>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <BottomSheet className={expanded ? "h-[70vh]" : ""}>
          <div className="flex justify-center mb-3">
            <StatusPill status={status} />
          </div>

          {/* Driver info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-y-primary flex items-center justify-center text-y-dark font-bold text-sm">R</div>
            <div className="flex-1">
              <p className="font-bold text-rx-black text-sm">Ravi Kumar · ⭐ 4.8</p>
              <p className="text-rx-gray-400 text-xs">TN 09 AB 1234</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-rx-gray-100 flex items-center justify-center">
              <MessageSquare size={16} className="text-rx-gray-700" />
            </button>
            <button className="w-9 h-9 rounded-full bg-rx-gray-100 flex items-center justify-center">
              <Phone size={16} className="text-rx-gray-700" />
            </button>
          </div>

          {/* Progress steps */}
          <div className="flex items-center mb-4">
            {stepLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i <= statusIdx ? "bg-y-primary text-y-dark" : "bg-rx-gray-100 text-rx-gray-400"
                  }`}>{i + 1}</div>
                  <span className="text-[10px] text-rx-gray-400 mt-1">{label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-1 ${i < statusIdx ? "bg-y-primary" : "bg-rx-gray-100"}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* ETA */}
          <div className="flex items-center gap-2 bg-off-white rounded-input px-3 py-2 mb-4">
            <Clock size={16} className="text-y-primary" />
            <span className="text-sm text-rx-black font-medium">8 min remaining</span>
          </div>

          {expanded && (
            <div className="space-y-3 mb-4">
              <div className="bg-off-white rounded-card p-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-rx-gray-700">Base fare</span><span>₹40</span></div>
                <div className="flex justify-between"><span className="text-rx-gray-700">Distance</span><span>₹68</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span className="text-green-success">₹149</span></div>
              </div>
              <Button variant="outline-red" className="w-full gap-2" size="sm">
                <AlertTriangle size={16} /> Emergency SOS
              </Button>
              <button className="text-red-danger text-sm font-medium w-full text-center">Cancel Ride</button>
            </div>
          )}

          <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-center w-full text-rx-gray-400 text-xs gap-1 mb-3">
            <ChevronUp size={14} className={expanded ? "rotate-180" : ""} /> {expanded ? "Less" : "More details"}
          </button>

          {/* Dev: tap to advance status */}
          <Button className="w-full" onClick={advanceStatus}>
            {statusIdx === 0 && "Simulate: Driver Arrived"}
            {statusIdx === 1 && "Simulate: Trip Started"}
            {statusIdx === 2 && "Simulate: Trip Completed"}
          </Button>
        </BottomSheet>
      </div>

      <GeminiChatWidget />
    </div>
  );
};

export default ActiveRide;
