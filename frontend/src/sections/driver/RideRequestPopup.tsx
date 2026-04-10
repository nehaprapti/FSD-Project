import React from 'react';
import { GlassCard, Button } from '../../components/UI';

export const RideRequestPopup = ({ onAccept, onReject }: any) => (
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
