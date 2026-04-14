import React from 'react';
import { GlassCard } from '../../components/UI';

export const EarningsPage = () => (
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
      <div className="text-5xl font-bold text-primary">₹124.50</div>
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
              ₹{(15 + i * 4.5).toFixed(2)}
            </div>
            <div className="text-xs text-white/50">Card</div>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);
