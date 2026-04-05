import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, DollarSign, Clock, User, Star } from "lucide-react";
import MapContainer from "@/components/shared/MapContainer";
import EarningsCard from "@/components/shared/EarningsCard";

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [online, setOnline] = useState(true);

  const navItems = [
    { icon: Home, label: "Home", path: "/driver/dashboard" },
    { icon: DollarSign, label: "Earnings", path: "/driver/earnings" },
    { icon: Clock, label: "History", path: "/driver/dashboard" },
    { icon: User, label: "Profile", path: "/driver/profile" },
  ];

  return (
    <div className="min-h-screen bg-carbon flex flex-col pb-16">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-y-primary bg-carbon-card flex items-center justify-center text-y-primary font-bold text-sm">R</div>
          <span className="text-white text-base">Hey, Ravi</span>
        </div>
        {/* Online/Offline toggle */}
        <button
          onClick={() => setOnline(!online)}
          className="flex items-center gap-2"
        >
          <span className={`text-xs font-bold ${online ? "text-green-success" : "text-rx-gray-400"}`}>
            {online ? "ONLINE" : "OFFLINE"}
          </span>
          <div className={`w-12 h-7 rounded-pill relative transition-colors ${online ? "bg-green-success" : "bg-rx-gray-700"}`}>
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform ${online ? "left-[22px]" : "left-0.5"}`} />
          </div>
        </button>
      </div>

      {/* Earnings Banner */}
      <div className="px-5">
        <EarningsCard
          label="Today's Earnings"
          amount="₹1,240"
          stats={[
            { label: "trips", value: "12" },
            { label: "km", value: "94" },
            { label: "hrs", value: "6.2" },
          ]}
          progress={62}
        />
      </div>

      {/* Dark Map */}
      <div className="mx-5 mt-4 rounded-card overflow-hidden h-[240px] relative">
        <MapContainer dark className="h-full">
          {/* Surge zones */}
          <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-y-primary/25 blur-sm" />
          <div className="absolute top-1/2 left-2/3 w-16 h-16 rounded-full bg-y-primary/20 blur-sm" />
          {/* Legend */}
          <div className="absolute bottom-3 right-3 bg-carbon/80 rounded-input px-3 py-1.5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-y-primary" />
            <span className="text-[11px] text-rx-gray-400">High demand</span>
          </div>
        </MapContainer>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 px-5 mt-4">
        {[
          { label: "Acceptance", value: "87%", color: "text-white" },
          { label: "Avg Rating", value: "4.8 ★", color: "text-y-primary" },
          { label: "Cancellation", value: "3%", color: "text-red-danger" },
        ].map(s => (
          <div key={s.label} className="flex-1 bg-carbon-card rounded-[12px] p-3.5 text-center">
            <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
            <p className="text-label text-rx-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Simulate request button */}
      <div className="px-5 mt-4">
        <button
          onClick={() => navigate("/driver/request")}
          className="w-full bg-y-primary/10 border border-y-primary/30 rounded-btn p-3 text-y-primary text-sm font-semibold"
        >
          Simulate Incoming Request →
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-carbon border-t border-carbon-border flex z-30">
        {navItems.map(item => {
          const active = item.path === "/driver/dashboard" && item.label === "Home";
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center py-3"
            >
              <item.icon size={20} className={active ? "text-y-primary" : "text-rx-gray-400"} />
              <span className={`text-[10px] mt-1 ${active ? "text-y-primary font-semibold" : "text-rx-gray-400"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DriverDashboard;
