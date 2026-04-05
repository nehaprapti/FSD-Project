import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginShell from "@/components/auth/LoginShell";

const DriverLogin: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  return (
    <LoginShell 
      title="Driver Partner" 
      subtitle="Start earning with every mile. Log in to your dashboard."
      role="driver"
    >
      <div className="space-y-5">
        {/* Phone input */}
        <div className="group relative transition-all duration-300">
          <label className="text-[10px] uppercase tracking-widest font-bold text-rx-gray-400 mb-1 ml-1 block">
            Partner ID / Phone
          </label>
          <div className="relative group-focus-within:ring-2 group-focus-within:ring-y-primary rounded-2xl transition-all duration-300">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-rx-black text-sm font-semibold border-r border-rx-gray-100 pr-3 h-6">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter registered mobile"
              className="w-full h-14 bg-white/50 backdrop-blur-sm rounded-2xl pl-24 pr-4 text-rx-black text-base font-medium outline-none border border-white/40 focus:bg-white transition-all duration-300"
            />
          </div>
        </div>

        <Button 
          className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-y-primary/20 hover:shadow-y-primary/40 transition-all duration-300 group" 
          onClick={() => navigate("/driver/dashboard")}
        >
          Go to Dashboard
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="pt-4 border-t border-rx-gray-100/50">
          <p className="text-center text-sm text-rx-gray-700 font-medium">
            New driver?{" "}
            <button onClick={() => navigate("/driver/onboarding")} className="text-y-primary font-bold hover:underline underline-offset-4">
              Register & Start Earning
            </button>
          </p>
        </div>

        {/* Driver Trust Badges */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-rx-gray-100/30 p-3 rounded-xl text-center border border-white/40 backdrop-blur-sm">
            <ShieldCheck size={16} className="mx-auto mb-1 text-rx-gray-700" />
            <p className="text-[10px] font-bold text-rx-gray-700 uppercase leading-none">Secure</p>
            <p className="text-[9px] font-medium text-rx-gray-400">Identity</p>
          </div>
          <div className="bg-rx-gray-100/30 p-3 rounded-xl text-center border border-white/40 backdrop-blur-sm">
            <Zap size={16} className="mx-auto mb-1 text-y-primary" />
            <p className="text-[10px] font-bold text-rx-gray-700 uppercase leading-none">Instant</p>
            <p className="text-[9px] font-medium text-rx-gray-400">Payouts</p>
          </div>
        </div>
      </div>
    </LoginShell>
  );
};

export default DriverLogin;
