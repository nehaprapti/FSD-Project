import React, { useState, useEffect } from "react";
import { ScreenTransition, GlassCard, Button, MapBackground } from "./UI";
import {
  Home,
  MapPin,
  DollarSign,
  User,
  Navigation,
  Phone,
  CheckCircle,
  Clock,
  FileText,
  Star,
  Menu,
  AlertCircle,
  LogOut,
  Loader2,
  Upload,
  Save,
  Edit2,
  ShieldAlert,
} from "lucide-react";
import * as verificationApi from "../api/verification";
import * as driverApi from "../api/driver";

export const DriverModule = () => {
  const [screen, setScreen] = useState("dashboard");
  const [showRequest, setShowRequest] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        return (
          <DriverDashboard
            setScreen={setScreen}
            setShowRequest={setShowRequest}
            user={user}
          />
        );
      case "navigation":
        return <NavigationScreen setScreen={setScreen} />;
      case "active":
        return <RideActive setScreen={setScreen} />;
      case "earnings":
        return <EarningsPage />;
      case "verification":
        return <DriverVerification />;
      case "profile":
        return <DriverProfile user={user} handleLogout={handleLogout} />;
      default:
        return (
          <DriverDashboard
            setScreen={setScreen}
            setShowRequest={setShowRequest}
            user={user}
          />
        );
    }
  };

  return (
    <div className="flex bg-dark h-screen overflow-hidden text-white relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 h-full glass-panel border-y-0 border-l-0 rounded-none flex-col z-50">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(255,214,0,0.4)]">
            D
          </div>
          <span className="text-xl font-black tracking-tight">DriverApp</span>
        </div>

        <div className="flex-1 py-10 px-4 flex flex-col gap-3">
          {[
            { id: "dashboard", icon: Home, label: "Dashboard" },
            { id: "earnings", icon: DollarSign, label: "Earnings" },
            { id: "verification", icon: FileText, label: "Documents" },
            { id: "profile", icon: User, label: "My Profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${screen === item.id ? "bg-primary text-black font-bold shadow-lg" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
            >
              <item.icon size={22} strokeWidth={screen === item.id ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
          >
            <LogOut size={22} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden glass-panel px-6 py-4 flex justify-between items-center z-40 relative rounded-none border-x-0 border-t-0">
          <div className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
              D
            </div>
            DriverApp
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/5 rounded-full"
          >
            <LogOut size={20} className="text-white/70" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative pb-20 lg:pb-0">
          <ScreenTransition keyId={screen} className="h-full">
            {renderScreen()}
          </ScreenTransition>
        </div>

        {/* Mobile Navigation (Hidden on Desktop) */}
        <div className="lg:hidden glass-panel absolute bottom-0 left-0 right-0 h-[80px] flex justify-around items-center px-6 z-40 rounded-none border-x-0 border-b-0 pb-safe">
          {[
            { id: "dashboard", icon: Home, label: "Home" },
            { id: "earnings", icon: DollarSign, label: "Earnings" },
            { id: "verification", icon: FileText, label: "Docs" },
            { id: "profile", icon: User, label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${screen === tab.id ? "text-primary" : "text-white/50"}`}
            >
              <tab.icon size={24} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showRequest && (
        <RideRequestPopup
          onAccept={() => {
            setShowRequest(false);
            setScreen("navigation");
          }}
          onReject={() => setShowRequest(false)}
        />
      )}
    </div>
  );
};

const DriverDashboard = ({ setScreen, setShowRequest, user }: any) => {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    driverApi
      .getProfile()
      .then((res) => {
        setProfile(res.data);
        setIsOnline(res.data?.availabilityStatus || false);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async () => {
    if (profile?.verificationStatus !== "approved") {
      alert("Verification Pending: You cannot go online until your account is approved by an administrator.");
      return;
    }

    const newVal = !isOnline;
    setIsOnline(newVal);
    try {
      await driverApi.updateAvailability(newVal);
    } catch (err) {
      setIsOnline(!newVal);
      alert("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  const isVerified = profile?.verificationStatus === "approved";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hi, {user.name?.split(" ")[0] || "Partner"}
          </h1>
          <p className="text-white/50 font-medium">{isVerified ? "Ready to hit the road?" : "Verify your account to start driving"}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={toggleAvailability}
            disabled={!isVerified}
            className={`w-16 h-8 rounded-full p-1 transition-all duration-300 shadow-lg ${!isVerified ? "opacity-30 cursor-not-allowed bg-white/5" : isOnline ? "bg-green-500 shadow-green-500/20" : "bg-white/10"}`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isOnline ? "translate-x-8" : "translate-x-0"}`}
            />
          </button>
          <span className={`text-[10px] font-black uppercase tracking-widest ${!isVerified ? "text-white/20" : isOnline ? "text-green-400" : "text-white/30"}`}>
            {!isVerified ? "Locked" : isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Status & Earnings */}
        <div className="space-y-8">
          {profile?.verificationStatus === "rejected" && (
            <GlassCard className="border-red-500/30 bg-red-500/10 h-fit border-l-4 border-l-red-500 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-2xl text-red-500 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-red-500">Access Restricted</h3>
                  <p className="text-xs text-red-400/70 mt-1">Your application was not approved for the following reason:</p>
                  <div className="mt-3 p-4 bg-black/40 rounded-2xl border border-red-500/10 shadow-inner">
                    <p className="text-sm text-red-400 font-medium italic leading-relaxed">
                      "{profile.verificationReason || "Generic rejection: High-quality documents required."}"
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-5 border-red-500/30 text-red-500 hover:bg-red-500/20 py-2 h-auto text-xs font-bold uppercase tracking-widest" 
                    onClick={() => setScreen('verification')}
                  >
                    Fix Issues & Re-upload
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}

          {(profile?.verificationStatus === "incomplete" || profile?.verificationStatus === "pending") && (
            <GlassCard className="border-yellow-500/30 bg-yellow-500/10 h-fit border-l-4 border-l-yellow-500">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-2xl text-yellow-500 shrink-0">
                  {profile.verificationStatus === "pending" ? <Clock size={24} /> : <ShieldAlert size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-yellow-500">
                    {profile.verificationStatus === "pending" ? "Review in Progress" : "Verification Required"}
                  </h3>
                  <p className="text-sm text-yellow-500/70 mt-1 leading-relaxed">
                    {profile.verificationStatus === "pending" 
                      ? "Our compliance team is currently reviewing your documents. This usually takes 24-48 hours."
                      : "Please upload your documents for review. You'll be able to go online once our team approves your profile."}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 py-2 h-auto text-xs" 
                    onClick={() => setScreen('verification')}
                  >
                    {profile.verificationStatus === "pending" ? "View Uploads" : "Go to Verification"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}

          {isOnline && isVerified && (
            <GlassCard className="border-green-500/30 bg-green-500/10 h-fit relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors" />
              <div className="flex items-center gap-3 text-green-400 font-bold mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                System Active
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Your location is being broadcasted. New ride requests will appear here.
              </p>
              <Button className="w-full shadow-lg shadow-primary/10" onClick={() => setShowRequest(true)}>
                Test Connection
              </Button>
            </GlassCard>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassCard className="hover:border-primary/30 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <DollarSign size={20} />
              </div>
              <div className="text-3xl font-black text-white">$124.50</div>
              <div className="text-xs text-white/40 uppercase font-black tracking-widest mt-1">Today's Earnings</div>
            </GlassCard>
            <GlassCard className="hover:border-primary/30 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle size={20} />
              </div>
              <div className="text-3xl font-black text-white">12</div>
              <div className="text-xs text-white/40 uppercase font-black tracking-widest mt-1">Trips Completed</div>
            </GlassCard>
          </div>

          <GlassCard className="border-white/5">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-sm uppercase tracking-widest text-white/50">Quick Tools</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={() => setScreen('earnings')} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-left">
                  <Clock size={18} className="text-primary mb-2" />
                  <div className="text-xs font-bold">History</div>
               </button>
               <button onClick={() => setScreen('verification')} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-left">
                  <FileText size={18} className="text-primary mb-2" />
                  <div className="text-xs font-bold">Docs</div>
               </button>
             </div>
          </GlassCard>
        </div>

        {/* Right Column: Chart & Recent */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/50 px-1">Performance Cycle</h3>
            <GlassCard className="h-64 flex items-end justify-between gap-2 p-8 border-white/5 shadow-2xl">
              {[40, 70, 45, 90, 60, 110, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group h-full">
                  <div
                    className="absolute bottom-0 w-full bg-linear-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 shadow-[0_0_20px_rgba(255,214,0,0.1)]"
                    style={{ height: `${h}%` }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold border border-white/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                    ${(h * 1.5).toFixed(0)}
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/50 px-1">Live Feed</h3>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="group p-4 bg-white/2 hover:bg-white/5 rounded-3xl border border-white/5 transition-all flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                      <Navigation size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Sector 5 → Airport</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-tighter">Completed • 0h 45m</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-green-400">+$32.40</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RideRequestPopup = ({ onAccept, onReject }: any) => (
  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
    <GlassCard className="w-full max-w-sm animate-in zoom-in-95 duration-200 border-primary/50 shadow-[0_0_50px_rgba(255,214,0,0.2)]">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center mx-auto mb-2 text-2xl font-bold text-primary">
          10
        </div>
        <h2 className="text-xl font-bold">New Ride Request</h2>
      </div>

      <div className="flex items-center gap-4 mb-6 bg-black/20 p-4 rounded-xl">
        <div className="flex flex-col items-center">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-0.5 h-8 bg-white/20 my-1" />
          <div className="w-2 h-2 rounded-sm bg-red-500" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold mb-4">123 Main St (3 min away)</div>
          <div className="text-sm font-bold">Airport Terminal 1</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 px-4">
        <div className="text-center">
          <div className="text-white/50 text-sm">Est. Fare</div>
          <div className="text-xl font-bold text-primary">$24.50</div>
        </div>
        <div className="w-px h-8 bg-white/20" />
        <div className="text-center">
          <div className="text-white/50 text-sm">Distance</div>
          <div className="text-xl font-bold">8.5 km</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onReject}>
          Reject
        </Button>
        <Button className="flex-1" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </GlassCard>
  </div>
);

const NavigationScreen = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-6 left-6 right-6 z-10">
      <GlassCard className="p-4 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black">
            <Navigation size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">3 min</div>
            <div className="text-sm text-white/70">to pickup (1.2 km)</div>
          </div>
        </div>
      </GlassCard>
    </div>
    <div className="absolute bottom-0 left-0 right-0 glass-panel rounded-t-3xl p-6 z-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden">
            <img
              src="https://picsum.photos/seed/passenger/100/100"
              alt="Passenger"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-bold">Aathi</h3>
            <div className="flex items-center gap-1 text-sm text-primary">
              <Star size={14} fill="currentColor" /> 4.8
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-12 h-12 p-0 rounded-full">
          <Phone size={20} />
        </Button>
      </div>
      <Button className="w-full" onClick={() => setScreen("active")}>
        Start Ride
      </Button>
    </div>
  </MapBackground>
);

const RideActive = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-6 left-6 right-6 z-10">
      <GlassCard className="p-4 bg-black/80 backdrop-blur-xl text-center">
        <div className="text-sm text-primary font-bold mb-1">
          RIDE IN PROGRESS
        </div>
        <div className="text-3xl font-bold">15 min</div>
        <div className="text-sm text-white/70">to destination (8.5 km)</div>
      </GlassCard>
    </div>
    <div className="absolute bottom-6 left-6 right-6 z-10">
      <Button
        variant="danger"
        className="w-full py-4 text-lg font-bold"
        onClick={() => setScreen("dashboard")}
      >
        End Ride & Collect $24.50
      </Button>
    </div>
  </MapBackground>
);

const EarningsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Earnings</h1>
    <div className="flex bg-black/40 p-1 rounded-xl mb-6">
      <button className="flex-1 py-2 rounded-lg bg-primary text-black font-medium text-sm">
        Daily
      </button>
      <button className="flex-1 py-2 rounded-lg text-white/70 font-medium text-sm">
        Weekly
      </button>
    </div>
    <GlassCard className="mb-8 text-center py-8">
      <div className="text-white/50 mb-2">Total Earnings Today</div>
      <div className="text-5xl font-bold text-primary">$124.50</div>
      <div className="text-sm text-green-400 mt-2">+12% from yesterday</div>
    </GlassCard>
    <h3 className="font-bold mb-4">Ride History</h3>
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <GlassCard key={i} className="flex justify-between items-center">
          <div>
            <div className="font-bold">Ride #{8493 + i}</div>
            <div className="text-sm text-white/50">10:30 AM • 8.5 km</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-primary">
              ${(15 + i * 4.5).toFixed(2)}
            </div>
            <div className="text-xs text-white/50">Card</div>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

const DriverVerification = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = () => {
    setLoading(true);
    verificationApi
      .getVerificationStatus()
      .then(setStatus)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileUpload = async (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await verificationApi.uploadDocument(type, file);
      fetchStatus();
    } catch (err) {
      alert("Failed to upload document.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );

  const docs = status?.documents || [];
  const requiredTypes = [
    "license",
    "id_proof",
    "vehicle_registration",
    "insurance",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div
          className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${
            status?.verificationStatus === "approved"
              ? "bg-green-500/20 text-green-400"
              : status?.verificationStatus === "rejected"
                ? "bg-red-500/20 text-red-500"
                : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {status?.verificationStatus || "Incomplete"}
        </div>
      </div>
      <p className="text-white/50 mb-6">Manage your verification documents</p>

      <div className="flex flex-col gap-4">
        {requiredTypes.map((type) => {
          const doc = docs.find((d: any) => d.documentType === type);
          return (
            <GlassCard
              key={type}
              className={`border-l-4 ${
                doc?.reviewStatus === "approved"
                  ? "border-l-green-500"
                  : doc?.reviewStatus === "rejected"
                    ? "border-l-red-500"
                    : doc
                      ? "border-l-yellow-500"
                      : "border-l-white/10"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold capitalize">
                    {type.replace("_", " ")}
                  </h3>
                  <p className="text-sm text-white/50">
                    {doc
                      ? `Uploaded on ${new Date(doc.uploadedAt).toLocaleDateString()}`
                      : "Not uploaded yet"}
                  </p>
                </div>
                {doc ? (
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        doc.reviewStatus === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : doc.reviewStatus === "rejected"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {doc.reviewStatus === "approved" && (
                        <CheckCircle size={12} />
                      )}
                      {doc.reviewStatus === "rejected" && (
                        <AlertCircle size={12} />
                      )}
                      {doc.reviewStatus === "pending" && <Clock size={12} />}
                      <span className="capitalize">{doc.reviewStatus}</span>
                    </div>
                    {doc.reviewStatus === "rejected" && (
                      <button 
                         onClick={() => document.getElementById(`file-${type}`)?.click()}
                        className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                         <Upload size={10} /> Re-upload
                      </button>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="text-xs py-1 px-3 h-auto flex gap-2"
                    onClick={() => document.getElementById(`file-${type}`)?.click()}
                  >
                    <Upload size={14} /> Upload
                  </Button>
                )}
                <input 
                  type="file" 
                  id={`file-${type}`} 
                  className="hidden" 
                  accept="image/*,.pdf" 
                  onChange={(e) => handleFileUpload(type, e)}
                />
              </div>
              {doc?.remarks && doc.reviewStatus === "rejected" && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                  <strong>Reason:</strong> {doc.remarks}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

const DriverProfile = ({ handleLogout }: any) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});

  useEffect(() => {
    driverApi
      .getProfile()
      .then((res) => {
        setProfile(res.data);
        setEditedData({
          name: res.data.userId.name,
          phone: res.data.userId.phone,
          vehicleInfo: {
            make: res.data.vehicleInfo.make,
            model: res.data.vehicleInfo.model,
            plate: res.data.vehicleInfo.plate,
            color: res.data.vehicleInfo.color,
            seats: res.data.vehicleInfo.seats,
          },
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await driverApi.updateProfile(editedData);
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <span className="text-white/50 animate-pulse font-medium">
          Loading Profile...
        </span>
      </div>
    );

  const data = profile || {};

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-10 pb-20">
      {/* Header Profile Section */}
      <div className="relative mb-8 pt-8">
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent rounded-3xl blur-2xl -z-10 h-40" />
        <div className="text-center relative">
          <div className="relative inline-block group">
            <div className="w-28 h-28 bg-dark border-2 border-primary/30 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center text-4xl font-bold shadow-2xl transition-transform duration-500 group-hover:scale-110">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <span className="relative text-primary drop-shadow-[0_0_10px_rgba(255,214,0,0.5)]">
                {data.userId?.name?.[0] || "D"}
              </span>
            </div>
            <div
              className={`absolute bottom-4 right-1 w-6 h-6 rounded-full border-4 border-dark group-hover:animate-ping ${
                data.verificationStatus === "approved"
                  ? "bg-green-500"
                  : data.verificationStatus === "rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
              title={data.verificationStatus}
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {data.userId?.name || "Partner"}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/20">
              <Star size={14} fill="currentColor" />{" "}
              {data.averageRating?.toFixed(1) || "5.0"}
            </div>
            <div className="text-white/40 text-sm font-medium">
              • {data.totalTrips || "0"} Trips
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          {/* Edit Trigger */}
          <div>
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 py-3 border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 py-3 shadow-[0_4px_20px_rgba(255,214,0,0.3)] gap-2"
                >
                  <Save size={18} /> Save
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full glass-panel py-3 flex items-center justify-center gap-2 text-primary font-bold hover:bg-white/5 transition-all border-primary/20"
              >
                <Edit2 size={18} /> Edit Your Profile
              </button>
            )}
          </div>

          <div className="relative group">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded-full hidden group-hover:block blur-[1px]" />
            <h3 className="text-xs font-black text-primary/50 uppercase tracking-[0.2em] mb-3 ml-1">
              Personal Details
            </h3>
            <GlassCard className="space-y-4 border-white/5 shadow-xl">
              <div className="relative">
                <div className="text-[10px] text-white/30 uppercase font-bold mb-1 ml-1 flex items-center gap-1">
                  <User size={10} /> Full Name
                </div>
                {isEditing ? (
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    value={editedData.name}
                    onChange={(e) =>
                      setEditedData({ ...editedData, name: e.target.value })
                    }
                  />
                ) : (
                  <div className="p-1 font-semibold text-white/90">
                    {data.userId?.name}
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="text-[10px] text-white/30 uppercase font-bold mb-1 ml-1 flex items-center gap-1">
                  <Phone size={10} /> Phone Number
                </div>
                {isEditing ? (
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    value={editedData.phone}
                    onChange={(e) =>
                      setEditedData({ ...editedData, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className="p-1 font-semibold text-white/90">
                    {data.userId?.phone}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 font-bold bg-red-500/5 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 group"
            >
              <LogOut
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Sign Out from Rider Hub
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          {/* Vehicle Section */}
          <div className="relative group">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded-full hidden group-hover:block blur-[1px]" />
            <h3 className="text-xs font-black text-primary/50 uppercase tracking-[0.2em] mb-3 ml-1">
              Vehicle Information
            </h3>
            <GlassCard className="space-y-6 border-white/5 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <div className="text-[10px] text-white/30 uppercase font-bold mb-1 ml-1 flex items-center gap-1">
                    Make
                  </div>
                  {isEditing ? (
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm"
                      value={editedData.vehicleInfo?.make}
                      placeholder="e.g. Toyota"
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          vehicleInfo: {
                            ...editedData.vehicleInfo,
                            make: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <div className="p-1 font-semibold text-white/90">
                      {data.vehicleInfo?.make}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div className="text-[10px] text-white/30 uppercase font-bold mb-1 ml-1">
                    Model
                  </div>
                  {isEditing ? (
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm"
                      value={editedData.vehicleInfo?.model}
                      placeholder="e.g. Prius"
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          vehicleInfo: {
                            ...editedData.vehicleInfo,
                            model: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <div className="p-1 font-semibold text-white/90">
                      {data.vehicleInfo?.model}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <div className="text-[10px] text-white/30 uppercase font-bold mb-1 ml-1 flex items-center gap-1">
                    Plate Number
                  </div>
                  {isEditing ? (
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm font-mono"
                      value={editedData.vehicleInfo?.plate}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          vehicleInfo: {
                            ...editedData.vehicleInfo,
                            plate: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <div className="p-1 font-mono font-bold text-white/90">
                      {data.vehicleInfo?.plate}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div className="text-[10px] text-white/30 uppercase font-bold mb-1 ml-1 flex items-center gap-1">
                    Color
                  </div>
                  {isEditing ? (
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm"
                      value={editedData.vehicleInfo?.color}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          vehicleInfo: {
                            ...editedData.vehicleInfo,
                            color: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <div className="p-1 font-semibold text-white/90">
                      {data.vehicleInfo?.color}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="text-[10px] text-white/30 uppercase font-bold mb-1 ml-1 flex items-center gap-1">
                  Passenger Seats
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    value={editedData.vehicleInfo?.seats}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        vehicleInfo: {
                          ...editedData.vehicleInfo,
                          seats: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                ) : (
                  <div className="p-1 font-semibold text-white/90">
                    {data.vehicleInfo?.seats} Total Seats
                  </div>
                )}
              </div>
            </GlassCard>
            
            <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Verification Security</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    Your document verification status is managed by the central admin team. Vehicle updates may require re-verification of RC and Insurance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
