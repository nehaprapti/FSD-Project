import React, { useState } from 'react';
import { GlassCard, Button, MapBackground } from '../../components/UI';
import { Navigation, Phone, User } from 'lucide-react';
import { socketService } from '../../api/socket';

export const NavigationScreen = ({ setScreen }: any) => {
  const [arrived, setArrived] = useState(false);
  const rideStr = sessionStorage.getItem('activeRide');
  const ride = rideStr ? JSON.parse(rideStr) : null;

  const handleArrived = () => {
    if (!ride) return;
    socketService.emit('ride:status_update', {
      rideId: ride.rideId,
      status: 'arrived'
    });
    setArrived(true);
  };

  const handleStart = () => {
    if (!ride) return;
    socketService.emit('ride:status_update', {
      rideId: ride.rideId,
      status: 'started'
    });
    setScreen("active");
  };

  const passengerId = ride?.passengerId || 'P001';
  const pickupAddr = ride?.pickup?.address || 'Pickup Location';

  return (
    <MapBackground center={ride?.pickup?.location?.coordinates ? [ride.pickup.location.coordinates[1], ride.pickup.location.coordinates[0]] : undefined}>
      <div className="absolute top-6 left-6 right-6 z-1000">
        <GlassCard className="p-4 bg-black/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black">
              <Navigation size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xl font-bold truncate">To: {pickupAddr}</div>
              <div className="text-sm text-white/70">Passenger waiting</div>
            </div>
          </div>
        </GlassCard>
      </div>
      <div className="absolute bottom-0 left-0 right-0 glass-panel rounded-t-3xl p-6 z-1000">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden flex items-center justify-center text-xl">
              <User />
            </div>
            <div>
              <h3 className="font-bold text-sm">Pass: {passengerId.substring(0, 8)}...</h3>
            </div>
          </div>
          <Button variant="outline" className="w-12 h-12 p-0 rounded-full">
            <Phone size={20} />
          </Button>
        </div>
        {!arrived ? (
           <Button className="w-full" onClick={handleArrived}>Arrived</Button>
        ) : (
           <Button className="w-full bg-green-500 text-black hover:bg-green-400" onClick={handleStart}>Start Ride</Button>
        )}
      </div>
    </MapBackground>
  );
};
