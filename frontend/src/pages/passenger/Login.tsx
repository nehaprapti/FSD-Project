import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginShell from "@/components/auth/LoginShell";

const PassengerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  return (
    <LoginShell 
      title="Welcome back!" 
      subtitle="Enter your phone number to continue your journey."
      role="passenger"
    >
      <div className="space-y-5">
        {/* Phone input */}
        <div className="group relative transition-all duration-300">
          <label className="text-[10px] uppercase tracking-widest font-bold text-rx-gray-400 mb-1 ml-1 block">
            Mobile Number
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
              placeholder="00000 00000"
              className="w-full h-14 bg-white/50 backdrop-blur-sm rounded-2xl pl-24 pr-4 text-rx-black text-base font-medium outline-none border border-white/40 focus:bg-white transition-all duration-300"
            />
          </div>
        </div>

        <Button 
          className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-y-primary/20 hover:shadow-y-primary/40 transition-all duration-300 group" 
          onClick={() => navigate("/passenger/home")}
        >
          Continue
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-rx-gray-100/50" />
          <span className="text-rx-gray-400 text-[10px] font-bold uppercase tracking-widest">Social Connect</span>
          <div className="flex-1 h-px bg-rx-gray-100/50" />
        </div>

        {/* Google */}
        <button className="w-full h-14 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-sm flex items-center justify-center gap-3 text-rx-black text-sm font-bold hover:bg-white transition-all duration-300 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 2.58z" fill="#EA4335"/></svg>
          Google
        </button>

        <p className="text-center text-sm text-rx-gray-700 font-medium pt-2">
          New here?{" "}
          <button onClick={() => navigate("/passenger/signup")} className="text-y-primary font-bold hover:underline underline-offset-4">
            Create account
          </button>
        </p>
      </div>
    </LoginShell>
  );
};

export default PassengerLogin;
