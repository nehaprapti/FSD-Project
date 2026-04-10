import React from 'react';
import { GlassCard, Button } from '../../components/UI';

export const RevenuePanel = () => (
  <div className="max-w-6xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Revenue & Payouts</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <GlassCard className="lg:col-span-2 flex flex-col justify-center items-center py-12">
        <div className="text-white/50 mb-2">Total Platform Revenue</div>
        <div className="text-5xl font-bold text-primary mb-4">$142,500</div>
        <div className="flex gap-8 text-sm">
          <div className="text-center">
            <div className="text-white/50">Driver Payouts (80%)</div>
            <div className="font-bold text-white">$114,000</div>
          </div>
          <div className="text-center">
            <div className="text-white/50">Platform Fee (20%)</div>
            <div className="font-bold text-green-400">$28,500</div>
          </div>
        </div>
      </GlassCard>
      <GlassCard>
        <h3 className="font-bold mb-4">Pending Payouts</h3>
        <div className="text-3xl font-bold mb-6">$12,450</div>
        <Button className="w-full">Process Payouts</Button>
      </GlassCard>
    </div>
  </div>
);
