import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone, AlertTriangle, Star } from "lucide-react";
import MapContainer from "@/components/shared/MapContainer";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";

const tripStatuses = [
  { label: "En Route to Pickup", pill: "driver-on-way" as const, btn: "I've Arrived", variant: "default" as const },
  { label: "Passenger Aboard", pill: "driver-arrived" as const, btn: "Start Trip", variant: "green" as const },
  { label: "Heading to Destination", pill: "trip-in-progress" as const, btn: "Complete Trip", variant: "green" as const },
];

const stepLabels = ["Pickup", "In Transit", "Drop"];

const DriverTrip: React.FC = () => {
  const navigate = useNavigate();
  const [statusIdx, setStatusIdx] = useState(0);
  const current = tripStatuses[statusIdx];

  const advance = () => {
    if (statusIdx < 2) setStatusIdx(statusIdx + 1);
    else navigate("/driver/dashboard");
  };

  return (
    <div className="min-h-screen bg-carbon relative">
      {/* Map */}
      <MapContainer dark className="h-[55vh]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
          <polyline points="150,450 300,380 450,300 600,250 700,150" fill="none" stroke="#F5C400" strokeWidth="4" strokeLinecap="round" />
          <circle cx="150" cy="450" r="8" fill="#2ECC71" />
          <circle cx="700" cy="150" r="8" fill="#E74C3C" />
        </svg>
      </MapContainer>

      {/* Nav bar */}
      <div className="absolute top-0 left-0 right-0 bg-carbon p-4 rounded-b-card z-10">
        <div className="flex items-center gap-3">
          <ArrowRight size={24} className="text-y-primary font-bold" />
          <div className="flex-1">
            <p className="text-white font-bold">Turn right onto Anna Salai</p>
            <p className="text-y-primary text-sm">0.4 km</p>
          </div>
        </div>
      </div>

      {/* Passenger strip */}
      <div className="absolute top-[72px] left-0 right-0 bg-carbon-card px-5 py-3 flex items-center z-10">
        <div className="w-8 h-8 rounded-full bg-rx-gray-700 flex items-center justify-center text-white text-xs font-bold mr-3">A</div>
        <div className="flex-1">
          <span className="text-white text-sm font-medium">Arjun Mehta</span>
          <span className="text-rx-gray-400 text-xs ml-2">⭐ 4.6</span>
        </div>
        <button className="w-9 h-9 rounded-full border border-y-primary flex items-center justify-center">
          <Phone size={16} className="text-y-primary" />
        </button>
      </div>

      {/* Bottom trip card */}
      <div className="absolute bottom-0 left-0 right-0 bg-carbon rounded-sheet p-5 z-20">
        {/* Progress steps */}
        <div className="flex items-center mb-4">
          {stepLabels.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i <= statusIdx ? "bg-y-primary text-y-dark" : "bg-carbon-border text-rx-gray-400"
                }`}>{i + 1}</div>
                <span className="text-[10px] text-rx-gray-400 mt-1">{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 mx-1 ${i < statusIdx ? "bg-y-primary" : "bg-carbon-border"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center mb-4">
          <StatusPill status={current.pill}>{current.label}</StatusPill>
        </div>

        <Button variant={current.variant} className="w-full" onClick={advance}>
          {current.btn}
        </Button>
      </div>

      {/* SOS */}
      <button className="fixed bottom-28 right-5 w-12 h-12 rounded-full bg-red-danger flex items-center justify-center z-30 shadow-lg">
        <AlertTriangle size={20} className="text-white" />
      </button>
    </div>
  );
};

export default DriverTrip;
