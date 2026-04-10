import React, { useState, useEffect } from 'react';
import { GlassCard, Button } from '../../components/UI';
import { Loader2, Star, Save, Edit2, User, Phone, LogOut } from 'lucide-react';
import * as driverApi from '../../api/driver';

export const DriverProfile = ({ handleLogout }: any) => {
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
                  <div className="p-3 bg-white/5 rounded-xl font-medium">
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
                  <div className="p-3 bg-white/5 rounded-xl font-medium">
                    {data.userId?.phone || "Not set"}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right side Vehicle */}
        <div className="lg:col-span-7">
          <div className="relative group">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded-full hidden group-hover:block blur-[1px]" />
            <h3 className="text-xs font-black text-primary/50 uppercase tracking-[0.2em] mb-3 ml-1">
              Vehicle Information
            </h3>
            <GlassCard className="border-white/5 shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "make", label: "Make", ex: "Toyota" },
                  { key: "model", label: "Model", ex: "Camry" },
                  { key: "color", label: "Color", ex: "Silver" },
                  { key: "plate", label: "License Plate", ex: "XYZ-1234" },
                ].map((field) => (
                  <div key={field.key} className="space-y-1">
                    <div className="text-[10px] text-white/30 uppercase font-bold ml-1">
                      {field.label}
                    </div>
                    {isEditing ? (
                      <input
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                        value={editedData.vehicleInfo[field.key]}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            vehicleInfo: {
                              ...editedData.vehicleInfo,
                              [field.key]: e.target.value,
                            },
                          })
                        }
                        placeholder={field.ex}
                      />
                    ) : (
                      <div className="p-3 bg-white/5 rounded-xl font-medium uppercase tracking-wider">
                        {data.vehicleInfo?.[field.key] || "N/A"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
          
          <div className="mt-12 text-center lg:text-left">
            <Button
              variant="danger"
              className="px-8 py-3 w-full lg:w-auto font-bold tracking-widest text-xs uppercase"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2 inline" />
              Sign Out Securely
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
