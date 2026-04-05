import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, ChevronRight, Star, Car } from "lucide-react";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";

const filters = ["All", "Completed", "Cancelled", "Shared"];

const mockRides = [
  { id: 1, day: "28", month: "Mar", pickup: "T. Nagar, Chennai", drop: "Anna Nagar, Chennai", fare: "₹187", type: "Economy", status: "completed" as const, driver: "Ravi Kumar", rating: 4.8 },
  { id: 2, day: "27", month: "Mar", pickup: "Besant Nagar", drop: "Adyar, Chennai", fare: "₹120", type: "Shared", status: "completed" as const, driver: "Suresh M", rating: 4.5 },
  { id: 3, day: "25", month: "Mar", pickup: "Central Station", drop: "Guindy, Chennai", fare: "₹95", type: "Economy", status: "cancelled" as const, driver: "—", rating: 0 },
  { id: 4, day: "24", month: "Mar", pickup: "Marina Beach", drop: "Mylapore, Chennai", fare: "₹210", type: "Premium", status: "completed" as const, driver: "Karthik R", rating: 4.9 },
  { id: 5, day: "22", month: "Mar", pickup: "Tambaram", drop: "Chromepet", fare: "₹75", type: "Economy", status: "completed" as const, driver: "Vijay S", rating: 4.3 },
];

const RideHistory: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeFilter === "All" ? mockRides : mockRides.filter(r =>
    r.status === activeFilter.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 bg-white">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft size={20} className="text-rx-black" /></button>
          <h1 className="text-xl font-bold text-rx-black">My Rides</h1>
        </div>
        <Filter size={20} className="text-rx-gray-700" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto bg-white border-b border-rx-gray-100">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-pill px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeFilter === f ? "bg-y-primary text-y-dark" : "bg-rx-gray-100 text-rx-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Rides list */}
      <div className="p-5 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Car size={64} className="text-y-primary mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-bold text-rx-black">No rides yet</h3>
            <Button className="mt-4" onClick={() => navigate("/passenger/home")}>Book your first ride</Button>
          </div>
        ) : (
          filtered.map(ride => (
            <div key={ride.id}>
              <button
                onClick={() => setExpandedId(expandedId === ride.id ? null : ride.id)}
                className="w-full bg-white rounded-[14px] border border-rx-gray-100 p-4 flex items-center gap-3 text-left"
              >
                <div className="text-center flex-shrink-0 w-10">
                  <p className="text-xl font-bold text-rx-black">{ride.day}</p>
                  <p className="text-[11px] text-rx-gray-400">{ride.month}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-rx-black truncate">{ride.pickup} → {ride.drop}</p>
                  <p className="text-label text-rx-gray-400 mt-0.5">{ride.type}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-bold text-rx-black">{ride.fare}</span>
                  <StatusPill status={ride.status} />
                </div>
                <ChevronRight size={16} className={`text-rx-gray-400 transition-transform ${expandedId === ride.id ? "rotate-90" : ""}`} />
              </button>

              {expandedId === ride.id && (
                <div className="bg-white rounded-b-[14px] border border-t-0 border-rx-gray-100 px-4 pb-4 -mt-2 pt-2">
                  <div className="flex gap-3 mb-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-success" />
                      <div className="w-px h-5 border-l border-dashed border-rx-gray-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-y-primary" />
                    </div>
                    <div className="text-sm">
                      <p className="text-rx-black">{ride.pickup}</p>
                      <div className="h-3" />
                      <p className="text-rx-black">{ride.drop}</p>
                    </div>
                  </div>
                  {ride.driver !== "—" && (
                    <p className="text-sm text-rx-gray-700 mb-3">Driver: {ride.driver} · ⭐ {ride.rating}</p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Rebook</Button>
                    {ride.status === "completed" && (
                      <Button size="sm" className="flex-1">Rate this trip</Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideHistory;
