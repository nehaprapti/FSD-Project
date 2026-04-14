import React from 'react';
import { GlassCard, Button, MapBackground } from '../../components/UI';
import { socketService } from '../../api/socket';

export const RideActive = ({ setScreen }: any) => {
  const rideStr = sessionStorage.getItem('activeRide');
  const ride = rideStr ? JSON.parse(rideStr) : null;
  const dropAddr = ride?.drop?.address || 'Drop Location';

  const handleComplete = () => {
    if (!ride) return;
    socketService.emit('ride:status_update', {
      rideId: ride.rideId,
      status: 'completed'
    });
    sessionStorage.removeItem('activeRide');
    setScreen("dashboard");
  };

  return (
    <MapBackground center={ride?.drop?.location?.coordinates ? [ride.drop.location.coordinates[1], ride.drop.location.coordinates[0]] : undefined}>
      <div className="absolute top-6 left-6 right-6 z-1000">
        <GlassCard className="p-4 bg-black/80 backdrop-blur-xl text-center">
          <div className="text-sm text-primary font-bold mb-1">
            RIDE IN PROGRESS
          </div>
          <div className="text-xl font-bold truncate">To: {dropAddr}</div>
        </GlassCard>
      </div>
      <div className="absolute bottom-6 left-6 right-6 z-1000">
        <Button
          variant="danger"
          className="w-full py-4 text-lg font-bold"
          onClick={handleComplete}
        >
          Complete Trip
        </Button>
      </div>
    </MapBackground>
  );
};
