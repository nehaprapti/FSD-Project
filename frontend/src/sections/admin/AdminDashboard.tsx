import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/UI';
import { Loader2 } from 'lucide-react';
import * as adminApi from '../../api/admin';

export const AdminDashboard = ({ user }: { user: any }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAdminDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-white/50">Welcome back, {user.name || 'Admin'}. Here's what's happening today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: stats?.totalUsers || '0', change: '+0%' },
          { label: 'Active Rides', value: stats?.ongoingRides || '0', change: '+0%' },
          { label: 'Revenue (Total)', value: `$${stats?.totalRevenue || '0'}`, change: '+0%' },
          { label: 'Drivers Online', value: stats?.activeDriversNow || '0', change: '+0%' }
        ].map((kpi, i) => (
          <GlassCard key={i}>
            <div className="text-white/50 text-sm mb-2">{kpi.label}</div>
            <div className="text-3xl font-bold text-white mb-2">{kpi.value}</div>
            <div className={`text-sm ${kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{kpi.change} this week</div>
          </GlassCard>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-bold mb-4">Daily Rides</h3>
          <div className="flex-1 flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 60, 110, 85, 100, 120, 95].map((h, i) => (
              <div key={i} className="w-full bg-white/10 rounded-t-sm relative group">
                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-bold mb-4">Demand Heatmap</h3>
          <div className="flex-1 bg-linear-to-r from-transparent bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[20px_20px] rounded-xl relative overflow-hidden">
            <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-red-500/40 blur-2xl rounded-full" />
            <div className="absolute top-[50%] left-[60%] w-40 h-40 bg-primary/40 blur-2xl rounded-full" />
            <div className="absolute top-[70%] left-[20%] w-24 h-24 bg-green-500/40 blur-2xl rounded-full" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
