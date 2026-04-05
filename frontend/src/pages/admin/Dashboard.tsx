import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatusPill from "@/components/shared/StatusPill";
import { TrendingUp, Car, Users, Shield } from "lucide-react";

const kpis = [
  { label: "Total Rides Today", value: "1,247", trend: "+12%", icon: Car },
  { label: "Daily Revenue", value: "₹2,84,500", trend: "+8%", icon: TrendingUp, green: true },
  { label: "Active Drivers", value: "342", sub: "of 520 total", icon: Users },
  { label: "Pending Verifications", value: "23", badge: true, icon: Shield },
];

const liveRides = [
  { id: "RX-4521", passenger: "Arjun Mehta", driver: "Ravi Kumar", area: "T. Nagar", status: "in-transit" as const, time: "2:34 PM" },
  { id: "RX-4520", passenger: "Priya Sharma", driver: "Suresh M", area: "Anna Nagar", status: "in-transit" as const, time: "2:30 PM" },
  { id: "RX-4519", passenger: "Karthik R", driver: "—", area: "Besant Nagar", status: "searching" as const, time: "2:28 PM" },
  { id: "RX-4518", passenger: "Deepa V", driver: "Vijay S", area: "Guindy", status: "in-transit" as const, time: "2:25 PM" },
  { id: "RX-4517", passenger: "Rahul P", driver: "—", area: "Tambaram", status: "cancelled" as const, time: "2:20 PM" },
];

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-rx-black mb-6">Dashboard</h1>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map(kpi => (
            <div key={kpi.label} className="bg-white rounded-card shadow-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label text-rx-gray-400">{kpi.label}</span>
                <kpi.icon size={18} className="text-rx-gray-400" />
              </div>
              <p className={`text-2xl font-bold ${kpi.green ? "text-green-success" : "text-rx-black"}`}>
                {kpi.value}
              </p>
              {kpi.trend && (
                <span className="inline-flex items-center gap-1 text-green-success text-xs font-semibold mt-1">
                  <TrendingUp size={12} /> {kpi.trend}
                </span>
              )}
              {kpi.sub && <p className="text-rx-gray-400 text-xs mt-1">{kpi.sub}</p>}
              {kpi.badge && (
                <span className="inline-block bg-y-surface text-y-text text-xs font-bold rounded-pill px-2 py-0.5 mt-1">{kpi.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Live rides table */}
        <div className="bg-white rounded-card shadow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-rx-black">Live Rides</h2>
            <div className="w-2.5 h-2.5 rounded-full bg-green-success animate-pulse" />
            <span className="text-rx-gray-400 text-sm">14 active</span>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left text-label text-rx-gray-400 border-b border-rx-gray-100">
                <th className="pb-3 pr-4">Ride ID</th>
                <th className="pb-3 pr-4">Passenger</th>
                <th className="pb-3 pr-4">Driver</th>
                <th className="pb-3 pr-4">Pickup Area</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Started At</th>
              </tr>
            </thead>
            <tbody>
              {liveRides.map(ride => (
                <tr key={ride.id} className="border-b border-rx-gray-100 last:border-0 hover:bg-y-surface/50 transition-colors">
                  <td className="py-3 pr-4 text-sm font-medium text-rx-black">{ride.id}</td>
                  <td className="py-3 pr-4 text-sm text-rx-black">{ride.passenger}</td>
                  <td className="py-3 pr-4 text-sm text-rx-gray-700">{ride.driver}</td>
                  <td className="py-3 pr-4 text-sm text-rx-gray-700">{ride.area}</td>
                  <td className="py-3 pr-4"><StatusPill status={ride.status} /></td>
                  <td className="py-3 text-sm text-rx-gray-400">{ride.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-rx-gray-100">
            <span className="text-xs text-rx-gray-400">Showing 5 of 14</span>
            <div className="flex gap-1">
              {[1,2,3].map(p => (
                <button key={p} className={`w-8 h-8 rounded text-xs font-semibold ${p === 1 ? "bg-y-primary text-y-dark" : "text-rx-gray-400 hover:bg-rx-gray-100"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
