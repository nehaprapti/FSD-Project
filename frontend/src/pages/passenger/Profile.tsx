import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Bell, Shield, LogOut, ChevronRight } from "lucide-react";

const items = [
  { icon: MapPin, label: "Saved Places", desc: "Home, Work, and more" },
  { icon: CreditCard, label: "Payment Methods", desc: "Wallet, UPI, Cards" },
  { icon: Bell, label: "Notifications", desc: "Ride updates, offers" },
  { icon: Shield, label: "Safety", desc: "Emergency contacts, preferences" },
];

const PassengerProfile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-off-white">
      <div className="bg-white px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}><ArrowLeft size={20} className="text-rx-black" /></button>
          <h1 className="text-xl font-bold text-rx-black">Profile</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-y-primary flex items-center justify-center text-y-dark font-bold text-2xl">A</div>
          <div>
            <h2 className="font-bold text-rx-black text-lg">Arjun Mehta</h2>
            <p className="text-rx-gray-400 text-sm">+91 98765 43210</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-2">
        {items.map(item => (
          <button key={item.label} className="w-full bg-white rounded-card p-4 flex items-center gap-4 shadow-card text-left">
            <item.icon size={20} className="text-y-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-rx-black text-sm">{item.label}</p>
              <p className="text-rx-gray-400 text-xs">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-rx-gray-400" />
          </button>
        ))}

        <button className="w-full bg-white rounded-card p-4 flex items-center gap-4 shadow-card text-left mt-6" onClick={() => navigate("/")}>
          <LogOut size={20} className="text-red-danger flex-shrink-0" />
          <span className="font-semibold text-red-danger text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default PassengerProfile;
