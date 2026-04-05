import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = ["Name & Email", "Phone & OTP", "Password"];

const PassengerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-off-white px-6 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => step > 0 ? setStep(step - 1) : navigate("/passenger/login")} className="p-1">
            <ArrowLeft size={20} className="text-rx-black" />
          </button>
          <h1 className="text-xl font-bold text-rx-black">Create Account</h1>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i <= step ? "bg-y-primary" : "bg-rx-gray-100"}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full h-12 bg-off-white rounded-input px-4 text-rx-black text-sm outline-none focus:ring-2 focus:ring-y-primary" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" className="w-full h-12 bg-off-white rounded-input px-4 text-rx-black text-sm outline-none focus:ring-2 focus:ring-y-primary" />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-rx-gray-700 text-sm font-medium">
                <span>🇮🇳</span><span>+91</span>
              </div>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="w-full h-12 bg-off-white rounded-input pl-20 pr-4 text-rx-black text-sm outline-none focus:ring-2 focus:ring-y-primary" />
            </div>
            <div>
              <p className="text-sm text-rx-gray-700 mb-3">Enter the 6-digit code sent to your phone</p>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-bold bg-white border border-rx-gray-100 rounded-input outline-none focus:border-y-primary focus:ring-2 focus:ring-y-primary/20"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" className="w-full h-12 bg-off-white rounded-input px-4 text-rx-black text-sm outline-none focus:ring-2 focus:ring-y-primary" />
            <div className="bg-y-surface border-l-4 border-y-primary rounded-input p-4">
              <p className="text-sm text-y-text">For driver signup, you'll need to upload documents before your first trip.</p>
            </div>
          </div>
        )}

        <Button className="w-full mt-8" onClick={() => step < 2 ? setStep(step + 1) : navigate("/passenger/home")}>
          {step < 2 ? "Next" : "Create Account"}
        </Button>
      </div>
    </div>
  );
};

export default PassengerSignup;
