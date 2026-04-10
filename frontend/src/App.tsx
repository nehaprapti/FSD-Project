import React, { useState } from 'react';
import { AuthModule } from './components/Auth';
import { PassengerModule } from './components/Passenger';
import { DriverModule } from './components/Driver';
import { AdminModule } from './components/Admin';
import { AnimatePresence } from 'motion/react';

export type Role = 'auth' | 'passenger' | 'driver' | 'admin';

export default function App() {
  const [role, setRole] = useState<Role>('auth');

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        setRole(user.role);
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative flex flex-col font-sans">
      <AnimatePresence mode="wait">
        {role === 'auth' && <AuthModule key="auth" setRole={setRole} />}
        {role === 'passenger' && <PassengerModule key="passenger" />}
        {role === 'driver' && <DriverModule key="driver" />}
        {role === 'admin' && <AdminModule key="admin" />}
      </AnimatePresence>
    </div>
  );
}
