import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-y-dark flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-extrabold text-metric">
        <span className="text-y-primary">Rapid</span><span className="text-white">X</span>
      </h1>
      <p className="text-rx-gray-400 text-lg mt-2">Your ride, instantly.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-lg">
        <button onClick={() => navigate("/passenger/login")} className="bg-carbon-card border border-carbon-border rounded-card p-6 text-center hover:border-y-primary transition-colors">
          <Car size={32} className="text-y-primary mx-auto mb-3" />
          <p className="text-white font-bold">Passenger</p>
          <p className="text-rx-gray-400 text-xs mt-1">Book a ride</p>
        </button>
        <button onClick={() => navigate("/driver/login")} className="bg-carbon-card border border-carbon-border rounded-card p-6 text-center hover:border-y-primary transition-colors">
          <Users size={32} className="text-y-primary mx-auto mb-3" />
          <p className="text-white font-bold">Driver</p>
          <p className="text-rx-gray-400 text-xs mt-1">Start earning</p>
        </button>
        <button onClick={() => navigate("/admin/login")} className="bg-carbon-card border border-carbon-border rounded-card p-6 text-center hover:border-y-primary transition-colors">
          <Shield size={32} className="text-y-primary mx-auto mb-3" />
          <p className="text-white font-bold">Admin</p>
          <p className="text-rx-gray-400 text-xs mt-1">Control center</p>
        </button>
      </div>
    </div>
  );
};

export default Index;
