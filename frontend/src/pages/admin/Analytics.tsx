import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import MapContainer from "@/components/shared/MapContainer";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from "recharts";

const periods = ["7 days", "30 days", "3 months"];

const revenueData = [
  { day: "Mon", revenue: 42000 }, { day: "Tue", revenue: 38000 }, { day: "Wed", revenue: 55000 },
  { day: "Thu", revenue: 48000 }, { day: "Fri", revenue: 62000 }, { day: "Sat", revenue: 71000 }, { day: "Sun", revenue: 58000 },
];

const hourlyData = [
  { hour: "6AM", rides: 12 }, { hour: "8AM", rides: 45 }, { hour: "10AM", rides: 32 },
  { hour: "12PM", rides: 38 }, { hour: "2PM", rides: 28 }, { hour: "4PM", rides: 35 },
  { hour: "6PM", rides: 52 }, { hour: "8PM", rides: 48 }, { hour: "10PM", rides: 22 },
];

const topZones = [
  { zone: "T. Nagar", requests: 234, surge: "1.4x" },
  { zone: "Anna Nagar", requests: 198, surge: "1.2x" },
  { zone: "Adyar", requests: 167, surge: "1.0x" },
  { zone: "Guindy", requests: 145, surge: "1.6x" },
];

const AdminAnalytics: React.FC = () => {
  const [period, setPeriod] = useState("7 days");

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-rx-black mb-6">Analytics</h1>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue", value: "₹12,84,500", green: true },
            { label: "Avg Fare", value: "₹186" },
            { label: "Completion Rate", value: "94.2%", progress: 94 },
            { label: "Cancellation Rate", value: "5.8%", red: true },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-card shadow-card p-5">
              <p className="text-label text-rx-gray-400 mb-2">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.green ? "text-green-success" : kpi.red ? "text-red-danger" : "text-rx-black"}`}>
                {kpi.value}
              </p>
              {kpi.progress && (
                <div className="mt-2 h-2 bg-rx-gray-100 rounded-pill overflow-hidden">
                  <div className="h-full bg-y-primary rounded-pill" style={{ width: `${kpi.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-card shadow-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-rx-black">Revenue</h2>
            <div className="flex gap-1">
              {periods.map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`rounded-pill px-3 py-1 text-xs font-semibold ${period === p ? "bg-y-primary text-y-dark" : "text-rx-gray-400 hover:bg-rx-gray-100"}`}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="day" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#F5C400" fill="#FFF9DB" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Demand heatmap */}
        <div className="bg-white rounded-card shadow-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-rx-black">Live Demand Zones</h2>
              <div className="w-2 h-2 rounded-full bg-green-success animate-pulse" />
              <span className="text-rx-gray-400 text-xs">Updated 2 min ago</span>
            </div>
            <span className="bg-y-surface text-y-text text-xs font-bold rounded-pill px-3 py-1">Surge Active</span>
          </div>
          <div className="rounded-card overflow-hidden h-[360px] relative">
            <MapContainer className="h-full">
              {/* Heatmap zones */}
              <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-y-primary/30 blur-md" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-y-primary/40 blur-md" />
              <div className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full bg-green-success/20 blur-md" />
              <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-red-danger/20 blur-md" />
            </MapContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-rx-gray-400">Demand:</span>
            <div className="flex items-center gap-1"><div className="w-4 h-2 bg-green-success/40 rounded" /><span className="text-xs text-rx-gray-400">Low</span></div>
            <div className="flex items-center gap-1"><div className="w-4 h-2 bg-y-primary/40 rounded" /><span className="text-xs text-rx-gray-400">Medium</span></div>
            <div className="flex items-center gap-1"><div className="w-4 h-2 bg-y-primary/70 rounded" /><span className="text-xs text-rx-gray-400">High</span></div>
            <div className="flex items-center gap-1"><div className="w-4 h-2 bg-red-danger/40 rounded" /><span className="text-xs text-rx-gray-400">Very High</span></div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top zones */}
          <div className="bg-white rounded-card shadow-card p-5">
            <h2 className="text-lg font-bold text-rx-black mb-4">Top Pickup Zones</h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-label text-rx-gray-400 border-b border-rx-gray-100">
                  <th className="pb-2">Zone</th><th className="pb-2">Requests</th><th className="pb-2">Surge</th>
                </tr>
              </thead>
              <tbody>
                {topZones.map(z => (
                  <tr key={z.zone} className="border-b border-rx-gray-100 last:border-0">
                    <td className="py-2.5 text-sm text-rx-black font-medium">{z.zone}</td>
                    <td className="py-2.5 text-sm text-rx-black">{z.requests}</td>
                    <td className="py-2.5"><span className={`text-xs font-semibold ${parseFloat(z.surge) > 1 ? "text-y-text" : "text-rx-gray-400"}`}>{z.surge}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hourly chart */}
          <div className="bg-white rounded-card shadow-card p-5">
            <h2 className="text-lg font-bold text-rx-black mb-4">Hourly Ride Volume</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="hour" stroke="#999" fontSize={11} />
                <YAxis stroke="#999" fontSize={11} />
                <Tooltip />
                <Bar dataKey="rides" fill="#F5C400" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
