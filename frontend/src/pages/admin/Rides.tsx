import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatusPill from "@/components/shared/StatusPill";
import { X } from "lucide-react";

const rides = [
  { id: "RX-4521", passenger: "Arjun Mehta", driver: "Ravi Kumar", pickup: "T. Nagar, Chennai", drop: "Anna Nagar", fare: "₹187", status: "completed" as const, date: "Mar 28, 2:34 PM" },
  { id: "RX-4520", passenger: "Priya Sharma", driver: "Suresh M", pickup: "Besant Nagar", drop: "Adyar", fare: "₹120", status: "completed" as const, date: "Mar 28, 2:30 PM" },
  { id: "RX-4519", passenger: "Karthik R", driver: "—", pickup: "Central Station", drop: "Guindy", fare: "₹95", status: "cancelled" as const, date: "Mar 28, 2:28 PM" },
  { id: "RX-4518", passenger: "Deepa V", driver: "Vijay S", pickup: "Marina Beach", drop: "Mylapore", fare: "₹210", status: "in-transit" as const, date: "Mar 28, 2:25 PM" },
  { id: "RX-4517", passenger: "Rahul P", driver: "Ganesh R", pickup: "Tambaram", drop: "Chromepet", fare: "₹75", status: "completed" as const, date: "Mar 28, 2:20 PM" },
];

const AdminRides: React.FC = () => {
  const [detailRide, setDetailRide] = useState<typeof rides[0] | null>(null);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "In Transit", "Completed", "Cancelled"];
  const filtered = filter === "All" ? rides : rides.filter(r => {
    if (filter === "In Transit") return r.status === "in-transit";
    return r.status === filter.toLowerCase();
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-rx-black mb-6">All Rides</h1>

        <div className="flex gap-2 mb-4">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-pill px-4 py-1.5 text-sm font-semibold ${filter === f ? "bg-y-primary text-y-dark" : "bg-rx-gray-100 text-rx-gray-700"}`}>{f}</button>
          ))}
        </div>

        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-label text-rx-gray-400 border-b border-rx-gray-100">
                <th className="p-4">Ride ID</th><th className="p-4">Passenger</th><th className="p-4">Driver</th><th className="p-4">Route</th><th className="p-4">Fare</th><th className="p-4">Status</th><th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-rx-gray-100 last:border-0 hover:bg-y-surface/30 cursor-pointer" onClick={() => setDetailRide(r)}>
                  <td className="p-4 text-sm font-medium text-rx-black">{r.id}</td>
                  <td className="p-4 text-sm text-rx-black">{r.passenger}</td>
                  <td className="p-4 text-sm text-rx-gray-700">{r.driver}</td>
                  <td className="p-4 text-sm text-rx-gray-700 max-w-[200px] truncate">{r.pickup} → {r.drop}</td>
                  <td className="p-4 text-sm font-bold text-rx-black">{r.fare}</td>
                  <td className="p-4"><StatusPill status={r.status} /></td>
                  <td className="p-4 text-sm text-rx-gray-400">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {detailRide && (
        <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-rx-black">Ride {detailRide.id}</h2>
              <button onClick={() => setDetailRide(null)}><X size={20} className="text-rx-gray-400" /></button>
            </div>
            <StatusPill status={detailRide.status} className="mb-4" />
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-3 h-3 rounded-full bg-green-success" />
                  <div className="w-px h-6 border-l border-dashed border-rx-gray-400" />
                  <div className="w-3 h-3 rounded-full bg-y-primary" />
                </div>
                <div>
                  <p className="font-semibold text-rx-black text-sm">{detailRide.pickup}</p>
                  <div className="h-4" />
                  <p className="font-semibold text-rx-black text-sm">{detailRide.drop}</p>
                </div>
              </div>
              <div className="border-t border-rx-gray-100 pt-4 space-y-3">
                {[
                  { label: "Passenger", value: detailRide.passenger },
                  { label: "Driver", value: detailRide.driver },
                  { label: "Fare", value: detailRide.fare },
                  { label: "Date", value: detailRide.date },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-sm text-rx-gray-400">{item.label}</span>
                    <span className="text-sm font-medium text-rx-black">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminRides;
