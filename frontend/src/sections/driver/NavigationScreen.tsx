import React from 'react';
import { GlassCard, Button, MapBackground } from '../../components/UI';
import { Navigation, Phone, Star } from 'lucide-react';

export const NavigationScreen = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-6 left-6 right-6 z-10">
      <GlassCard className="p-4 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black">
            <Navigation size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">3 min</div>
            <div className="text-sm text-white/70">to pickup (1.2 km)</div>
          </div>
        </div>
      </GlassCard>
    </div>
    <div className="absolute bottom-0 left-0 right-0 glass-panel rounded-t-3xl p-6 z-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden">
            <img
              src="https://picsum.photos/seed/passenger/100/100"
              alt="Passenger"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-bold">Aathi</h3>
            <div className="flex items-center gap-1 text-sm text-primary">
              <Star size={14} fill="currentColor" /> 4.8
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-12 h-12 p-0 rounded-full">
          <Phone size={20} />
        </Button>
      </div>
      <Button className="w-full" onClick={() => setScreen("active")}>
        Start Ride
      </Button>
    </div>
  </MapBackground>
);
