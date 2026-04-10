import React, { useState, useEffect } from "react";
import { ScreenTransition, GlassCard, Button, Input } from "./UI";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { login, signupPassenger, signupDriver, verifyOtp } from "../api/auth";

export const AuthModule = ({
  setRole,
}: {
  setRole: (role: any) => void;
  key?: string;
}) => {
  const [screen, setScreen] = useState<"login" | "signup" | "otp">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(59);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup state
  const [signupRole, setSignupRole] = useState<"passenger" | "driver">(
    "passenger",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (screen === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [screen, timeLeft]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setRole(data.user.role);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      const response =
        signupRole === "passenger"
          ? await signupPassenger(payload)
          : await signupDriver(payload);

      setPendingUserId(response.userId);
      setScreen("otp");
      setTimeLeft(59);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!pendingUserId) return;
    setLoading(true);
    setError(null);
    try {
      const otp = otpValue.join("");
      if (otp.length !== 6) throw new Error("Please enter all 6 digits.");

      const data = await verifyOtp({ userId: pendingUserId, otp });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setRole(data.user.role);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Verification failed. Please check the OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden min-h-screen">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] z-10">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {screen === "login" && (
          <ScreenTransition keyId="login">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,214,0,0.3)]">
                <ArrowRight size={32} className="text-black" />
              </div>
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-white/50 mt-2">
                Sign in to continue your journey
              </p>
            </div>
            <GlassCard>
              <form onSubmit={handleLogin}>
                <Input
                  label="Email / Username"
                  type="text"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-end mb-6">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button
                  className="w-full mb-4"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </form>
              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-white/50 text-sm">OR</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>
              <Button variant="outline" className="w-full mb-6">
                Continue with Google
              </Button>
              <p className="text-center text-sm text-white/50">
                Don't have an account?{" "}
                <button
                  onClick={() => setScreen("signup")}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </GlassCard>
          </ScreenTransition>
        )}

        {screen === "signup" && (
          <ScreenTransition keyId="signup">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-white/50 mt-2">
                Join us as a Passenger or Driver
              </p>
            </div>
            <GlassCard>
              <div className="flex bg-black/40 p-1 rounded-xl mb-6">
                <button
                  onClick={() => setSignupRole("passenger")}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${signupRole === "passenger" ? "bg-primary text-black shadow-sm" : "text-white/70 hover:text-white"}`}
                >
                  Passenger
                </button>
                <button
                  onClick={() => setSignupRole("driver")}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${signupRole === "driver" ? "bg-primary text-black shadow-sm" : "text-white/70 hover:text-white"}`}
                >
                  Driver
                </button>
              </div>
              <form onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="John"
                    icon={User}
                    value={formData.firstName}
                    onChange={(e: any) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e: any) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e: any) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e: any) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e: any) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <label className="flex items-center gap-3 mb-6 cursor-pointer group">
                  <input type="checkbox" className="hidden" required />
                  <div className="w-5 h-5 rounded border border-white/20 bg-black/20 flex items-center justify-center group-hover:border-primary transition-colors">
                    <div className="w-3 h-3 bg-primary rounded-sm transition-opacity" />
                  </div>
                  <span className="text-sm text-white/70">
                    I agree to the Terms & Conditions
                  </span>
                </label>
                <Button
                  className="w-full mb-4"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
              <p className="text-center text-sm text-white/50">
                Already have an account?{" "}
                <button
                  onClick={() => setScreen("login")}
                  className="text-primary hover:underline"
                >
                  Login
                </button>
              </p>
            </GlassCard>
          </ScreenTransition>
        )}

        {screen === "otp" && (
          <ScreenTransition keyId="otp">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Verify Phone</h1>
              <p className="text-white/50 mt-2">
                Enter the 6-digit code sent to your phone
              </p>
            </div>
            <GlassCard>
              <div className="flex justify-between gap-2 mb-8">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otpValue[i]}
                    onChange={(e) => {
                      const newOtp = [...otpValue];
                      newOtp[i] = e.target.value;
                      setOtpValue(newOtp);
                      // Auto-focus next input
                      if (e.target.value && i < 5) {
                        const nextInput = document.getElementById(
                          `otp-${i + 1}`,
                        );
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otpValue[i] && i > 0) {
                        const prevInput = document.getElementById(
                          `otp-${i - 1}`,
                        );
                        prevInput?.focus();
                      }
                    }}
                    id={`otp-${i}`}
                    className="w-12 h-14 text-center text-2xl font-bold bg-black/20 border border-white/10 rounded-xl focus:border-primary focus:outline-none transition-colors"
                    placeholder="0"
                  />
                ))}
              </div>
              <Button className="w-full mb-6" onClick={handleVerify}>
                Verify & Continue
              </Button>
              <p className="text-center text-sm text-white/50">
                Didn't receive code?{" "}
                <button
                  className={`ml-1 ${timeLeft === 0 ? "text-primary hover:underline" : "text-white/30 cursor-not-allowed"}`}
                  disabled={timeLeft > 0}
                >
                  Resend{" "}
                  {timeLeft > 0 &&
                    `(0:${timeLeft.toString().padStart(2, "0")})`}
                </button>
              </p>
            </GlassCard>
          </ScreenTransition>
        )}
      </div>
    </div>
  );
};
