import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Car, Shield, ChevronRight } from "lucide-react";
import StatusPill from "@/components/shared/StatusPill";

const DriverProfile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-carbon pb-20">
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}><ArrowLeft size={20} className="text-white" /></button>
          <h1 className="text-xl font-bold text-white">Profile</h1>
        </div>

        {/* Profile card */}
        <div className="bg-carbon-card rounded-card p-5 text-center">
          <div className="w-20 h-20 rounded-full border-[3px] border-y-primary bg-carbon-border mx-auto flex items-center justify-center text-y-primary font-bold text-2xl">R</div>
          <h2 className="text-white font-bold text-xl mt-3">Ravi Kumar</h2>
          <div className="flex items-center justify-center gap-1 mt-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={16} className={s <= 4 ? "fill-y-primary text-y-primary" : "text-carbon-border"} />
            ))}
            <span className="text-white font-bold text-sm ml-1">4.8</span>
          </div>
          <StatusPill status="approved" className="mt-2">Verified Driver</StatusPill>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          {[
            { label: "Total Trips", value: "1,247" },
            { label: "Rating", value: "4.8 ★" },
            { label: "Earnings", value: "₹3.2L" },
          ].map(s => (
            <div key={s.label} className="flex-1 bg-carbon-card rounded-[12px] p-3.5 text-center">
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-label text-rx-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Vehicle info */}
        <div className="bg-carbon-card rounded-card p-4 mt-4">
          <div className="flex items-center gap-3">
            <Car size={24} className="text-y-primary" />
            <div>
              <p className="text-white font-semibold">White Maruti Swift Dzire</p>
              <p className="text-rx-gray-400 text-sm">TN 09 AB 1234 · Economy</p>
            </div>
          </div>
        </div>

        {/* Document status */}
        <div className="bg-carbon-card rounded-card p-4 mt-4">
          <h3 className="text-white font-semibold mb-3">Documents</h3>
          {["Driving License", "Aadhaar", "Registration", "Insurance"].map(doc => (
            <div key={doc} className="flex items-center justify-between py-2">
              <span className="text-rx-gray-400 text-sm">{doc}</span>
              <StatusPill status="approved" />
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/")} className="w-full text-red-danger text-sm font-semibold text-center mt-6">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DriverProfile;
