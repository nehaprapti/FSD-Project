import React, { useState } from 'react';
import { ScreenTransition, GlassCard, Button, MapBackground } from './UI';
import { Home, MapPin, DollarSign, User, Navigation, Phone, CheckCircle, Clock, FileText, Star, Menu, AlertCircle, LogOut } from 'lucide-react';

export const DriverModule = () => {
  const [screen, setScreen] = useState('dashboard');
  const [showRequest, setShowRequest] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  const renderScreen = () => {
    switch(screen) {
      case 'dashboard': return <DriverDashboard setScreen={setScreen} setShowRequest={setShowRequest} user={user} />;
      case 'navigation': return <NavigationScreen setScreen={setScreen} />;
      case 'active': return <RideActive setScreen={setScreen} />;
      case 'earnings': return <EarningsPage />;
      case 'verification': return <DriverVerification />;
      case 'profile': return <DriverProfile user={user} handleLogout={handleLogout} />;
      default: return <DriverDashboard setScreen={setScreen} setShowRequest={setShowRequest} user={user} />;
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <div className="glass-panel px-6 py-4 flex justify-between items-center z-40 absolute top-0 left-0 right-0 rounded-none border-x-0 border-t-0">
        <div className="font-bold text-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">D</div>
          DriverApp
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold leading-none">{user.name || 'User'}</div>
            <div className="text-[10px] text-white/50 leading-none mt-1">Driver</div>
          </div>
          <button onClick={handleLogout} className="p-2 bg-white/5 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut size={20} className="text-white/70" />
          </button>
        </div>
      </div>

      <div className="flex-1 pt-[72px] pb-[80px] overflow-y-auto relative">
        <ScreenTransition keyId={screen} className="h-full">
          {renderScreen()}
        </ScreenTransition>
      </div>

      <div className="glass-panel absolute bottom-0 left-0 right-0 h-[80px] flex justify-around items-center px-6 z-40 rounded-none border-x-0 border-b-0">
        {[
          { id: 'dashboard', icon: Home, label: 'Home' },
          { id: 'earnings', icon: DollarSign, label: 'Earnings' },
          { id: 'verification', icon: FileText, label: 'Docs' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setScreen(tab.id)} className={`flex flex-col items-center gap-1 p-2 transition-colors ${screen === tab.id || (screen === 'navigation' && tab.id === 'dashboard') || (screen === 'active' && tab.id === 'dashboard') ? 'text-primary' : 'text-white/50 hover:text-white'}`}>
            <tab.icon size={24} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {showRequest && <RideRequestPopup onAccept={() => { setShowRequest(false); setScreen('navigation'); }} onReject={() => setShowRequest(false)} />}
    </div>
  );
};

const DriverDashboard = ({ setScreen, setShowRequest, user }: any) => {
  const [isOnline, setIsOnline] = useState(false);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Hi, {user.name?.split(' ')[0] || 'Partner'}</h1>
          <p className="text-white/50">Ready to drive?</p>
        </div>
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`w-16 h-8 rounded-full p-1 transition-colors ${isOnline ? 'bg-green-500' : 'bg-white/20'}`}
        >
          <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isOnline ? 'translate-x-8' : 'translate-x-0'}`} />
        </button>
      </div>
      
      {isOnline && (
        <GlassCard className="mb-8 border-green-500/30 bg-green-500/10">
          <div className="flex items-center gap-3 text-green-400 font-bold">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            You're Online
          </div>
          <p className="text-sm text-white/70 mt-2">Waiting for ride requests...</p>
          <Button className="mt-4 w-full" onClick={() => setShowRequest(true)}>Simulate Request</Button>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <GlassCard className="p-4">
          <div className="text-white/50 text-sm mb-1">Today's Earnings</div>
          <div className="text-2xl font-bold text-primary">$124.50</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-white/50 text-sm mb-1">Rides Completed</div>
          <div className="text-2xl font-bold text-white">12</div>
        </GlassCard>
      </div>

      <h3 className="font-bold mb-4">Weekly Overview</h3>
      <GlassCard className="h-48 flex items-end justify-between gap-2 p-6">
        {[40, 70, 45, 90, 60, 110, 85].map((h, i) => (
          <div key={i} className="w-full bg-white/10 rounded-t-sm relative group">
            <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all" style={{ height: `${h}%` }} />
          </div>
        ))}
      </GlassCard>
    </div>
  );
};

const RideRequestPopup = ({ onAccept, onReject }: any) => (
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
        <Button variant="outline" className="flex-1" onClick={onReject}>Reject</Button>
        <Button className="flex-1" onClick={onAccept}>Accept</Button>
      </div>
    </GlassCard>
  </div>
);

const NavigationScreen = ({ setScreen }: any) => (
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
            <img src="https://picsum.photos/seed/passenger/100/100" alt="Passenger" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h3 className="font-bold">Aathi</h3>
            <div className="flex items-center gap-1 text-sm text-primary">
              <Star size={14} fill="currentColor" /> 4.8
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-12 h-12 p-0 rounded-full"><Phone size={20} /></Button>
      </div>
      <Button className="w-full" onClick={() => setScreen('active')}>Start Ride</Button>
    </div>
  </MapBackground>
);

const RideActive = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-6 left-6 right-6 z-10">
      <GlassCard className="p-4 bg-black/80 backdrop-blur-xl text-center">
        <div className="text-sm text-primary font-bold mb-1">RIDE IN PROGRESS</div>
        <div className="text-3xl font-bold">15 min</div>
        <div className="text-sm text-white/70">to destination (8.5 km)</div>
      </GlassCard>
    </div>
    <div className="absolute bottom-6 left-6 right-6 z-10">
      <Button variant="danger" className="w-full py-4 text-lg font-bold" onClick={() => setScreen('dashboard')}>End Ride & Collect $24.50</Button>
    </div>
  </MapBackground>
);

const EarningsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Earnings</h1>
    <div className="flex bg-black/40 p-1 rounded-xl mb-6">
      <button className="flex-1 py-2 rounded-lg bg-primary text-black font-medium text-sm">Daily</button>
      <button className="flex-1 py-2 rounded-lg text-white/70 font-medium text-sm">Weekly</button>
    </div>
    <GlassCard className="mb-8 text-center py-8">
      <div className="text-white/50 mb-2">Total Earnings Today</div>
      <div className="text-5xl font-bold text-primary">$124.50</div>
      <div className="text-sm text-green-400 mt-2">+12% from yesterday</div>
    </GlassCard>
    <h3 className="font-bold mb-4">Ride History</h3>
    <div className="flex flex-col gap-4">
      {[1,2,3].map(i => (
        <GlassCard key={i} className="flex justify-between items-center">
          <div>
            <div className="font-bold">Ride #{8493 + i}</div>
            <div className="text-sm text-white/50">10:30 AM • 8.5 km</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-primary">${(15 + i * 4.5).toFixed(2)}</div>
            <div className="text-xs text-white/50">Card</div>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

const DriverVerification = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-2">Documents</h1>
    <p className="text-white/50 mb-6">Manage your verification documents</p>
    
    <div className="flex flex-col gap-4">
      <GlassCard className="border-green-500/30">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold">Driving License</h3>
            <p className="text-sm text-white/50">Valid till 2028</p>
          </div>
          <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={12} /> Approved
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="border-primary/30">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold">Vehicle RC</h3>
            <p className="text-sm text-white/50">Uploaded 2 days ago</p>
          </div>
          <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} /> Pending
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="border-red-500/30">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold">ID Proof</h3>
            <p className="text-sm text-white/50">Image blurry</p>
          </div>
          <div className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <AlertCircle size={12} /> Rejected
          </div>
        </div>
        <Button variant="outline" className="w-full text-sm py-2">Re-upload Document</Button>
      </GlassCard>
    </div>
  </div>
);

const DriverProfile = () => (
  <div className="p-6">
    <div className="text-center mb-8">
      <div className="w-24 h-24 bg-gray-600 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary">
        <img src="https://picsum.photos/seed/driver/150/150" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <h1 className="text-2xl font-bold">Mike Driver</h1>
      <div className="flex items-center justify-center gap-1 text-primary mt-1">
        <Star size={16} fill="currentColor" /> 4.9 Rating
      </div>
    </div>
    
    <GlassCard className="mb-4">
      <h3 className="font-bold mb-4 text-white/50 text-sm uppercase tracking-wider">Personal Info</h3>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-white/50">Full Name</div>
          <div className="font-medium">Mike Driver</div>
        </div>
        <div>
          <div className="text-sm text-white/50">Phone Number</div>
          <div className="font-medium">+1 987 654 3210</div>
        </div>
      </div>
    </GlassCard>
    
    <GlassCard className="mb-8">
      <h3 className="font-bold mb-4 text-white/50 text-sm uppercase tracking-wider">Vehicle Info</h3>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-white/50">Model</div>
          <div className="font-medium">Toyota Prius (White)</div>
        </div>
        <div>
          <div className="text-sm text-white/50">License Plate</div>
          <div className="font-medium">ABC 1234</div>
        </div>
      </div>
    </GlassCard>
    
    <Button variant="danger" className="w-full" onClick={() => window.location.reload()}>Log Out</Button>
  </div>
);
