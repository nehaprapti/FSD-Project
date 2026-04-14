import React, { useState, useEffect } from 'react';
import { GlassCard, Button } from '../../components/UI';
import { DollarSign, CheckCircle, Clock, FileText, Navigation, AlertCircle, ShieldAlert, Loader2 } from 'lucide-react';
import * as driverApi from '../../api/driver';
import { socketService } from '../../api/socket';
import { getRideHistory } from '../../api/rides';

export const DriverDashboard = ({ setScreen, setShowRequest, user }: any) => {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      driverApi.getProfile(),
      driverApi.getEarningsSummary('today').catch(() => null), // fail gracefully
      getRideHistory().catch(() => ({ data: { data: [] } }))
    ])
    .then(([profileRes, earningsData, ridesRes]) => {
      setProfile(profileRes.data);
      setIsOnline(profileRes.data?.availabilityStatus || false);
      setEarnings(earningsData);
      setRides((ridesRes.data?.data || []).slice(0, 4));
    })
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return; // Prevent overwriting DB with false on mount before fetching!

    socketService.emit('driver:availability', { online: isOnline });

    let watchId: number;
    if (isOnline) {
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition((position) => {
          socketService.emit('driver:location_update', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed,
            heading: position.coords.heading
          });
        }, (err) => console.error(err), {
          enableHighAccuracy: true,
        });
      }
    }
    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline, loading]);

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
              <div className="text-3xl font-black text-white">₹{earnings?.totalAmount?.toFixed(2) || "0.00"}</div>
              <div className="text-xs text-white/40 uppercase font-black tracking-widest mt-1">Today's Earnings</div>
            </GlassCard>
            <GlassCard className="hover:border-primary/30 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle size={20} />
              </div>
              <div className="text-3xl font-black text-white">{earnings?.totalTrips || 0}</div>
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
                    ₹{(h * 1.5).toFixed(0)}
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/50 px-1">Live Feed</h3>
            <div className="space-y-3">
              {rides.length === 0 ? (
                <div className="text-sm text-white/30 italic px-2">No recent rides tracked.</div>
              ) : rides.map((ride, i) => (
                <div key={i} className="group p-4 bg-white/2 hover:bg-white/5 rounded-3xl border border-white/5 transition-all flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                      <Navigation size={20} />
                    </div>
                    <div className="overflow-hidden w-full max-w-[120px] sm:max-w-[150px]">
                      <div className="text-sm font-bold truncate" title={`${ride.pickup?.address} → ${ride.drop?.address}`}>
                        {ride.pickup?.address?.split(',')[0]} → {ride.drop?.address?.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-tighter truncate">
                        {ride.status.replace(/_/g, ' ')} • {new Date(ride.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <div className="text-sm font-black text-green-400">
                      ₹{ride.finalFare || ride.estimatedFare || '0.00'}
                    </div>
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
