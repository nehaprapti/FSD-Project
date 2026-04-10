import React from 'react';
import { GlassCard, Button, MapBackground } from '../../components/UI';

export const RideActive = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-6 left-6 right-6 z-10">
      <GlassCard className="p-4 bg-black/80 backdrop-blur-xl text-center">
        <div className="text-sm text-primary font-bold mb-1">
          RIDE IN PROGRESS
        </div>
        <div className="text-3xl font-bold">15 min</div>
        <div className="text-sm text-white/70">to destination (8.5 km)</div>
      </GlassCard>
    </div>
    <div className="absolute bottom-6 left-6 right-6 z-10">
      <Button
        variant="danger"
        className="w-full py-4 text-lg font-bold"
        onClick={() => setScreen("dashboard")}
      >
        End Ride & Collect $24.50
      </Button>
    </div>
  </MapBackground>
);
