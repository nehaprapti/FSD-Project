import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginShell from "@/components/auth/LoginShell";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    navigate("/admin/dashboard");
  };

  return (
    <LoginShell
      title="Admin Portal"
      subtitle="Authorized access only. Monitor and manage RapidX platform."
      role="admin"
    >
      <div className="space-y-5">
        {/* Email input */}
        <div className="group relative">
          <div className="relative group-focus-within:ring-2 group-focus-within:ring-y-primary rounded-2xl transition-all duration-300">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rx-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Admin Email"
              className={`w-full h-14 bg-white/5 pr-4 pl-12 text-white text-base font-medium outline-none border transition-all duration-300 rounded-2xl ${
                error ? "border-red-danger" : "border-white/10"
              } focus:bg-white/10`}
            />
          </div>
        </div>

        {/* Password input */}
        <div className="group relative">
          <div className="relative group-focus-within:ring-2 group-focus-within:ring-y-primary rounded-2xl transition-all duration-300">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rx-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Secure Password"
              className={`w-full h-14 bg-white/5 pr-12 pl-12 text-white text-base font-medium outline-none border transition-all duration-300 rounded-2xl ${
                error ? "border-red-danger" : "border-white/10"
              } focus:bg-white/10`}
            />
            <button
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-rx-gray-400 hover:text-white transition-colors"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-danger text-xs font-bold px-2 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        <Button
          className="w-full h-14 rounded-2xl text-base font-bold shadow-2xl transition-all duration-300 bg-y-primary text-rx-black hover:bg-y-hover mt-4"
          onClick={handleLogin}
        >
          Access Control Center
          <Shield size={18} className="ml-2" />
        </Button>

        <div className="pt-6 text-center border-t border-white/5">
          <p className="text-rx-gray-400 text-xs font-medium">
            Forgot password? Contact system administrator.
          </p>
        </div>
      </div>
    </LoginShell>
  );
};

export default AdminLogin;
