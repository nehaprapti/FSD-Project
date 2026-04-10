import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthModule } from './components/Auth';
import { PassengerModule } from './components/Passenger';
import { DriverModule } from './components/Driver';
import { AdminModule } from './components/Admin';
import { AnimatePresence, motion } from 'motion/react';

export type Role = 'auth' | 'passenger' | 'driver' | 'admin';

export default function App() {
  const [role, setRole] = useState<Role>('auth');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        setRole(user.role);
      } catch (e) {
        sessionStorage.clear();
      }
    }
    setIsInitialized(true);
  }, []);

  if (!isInitialized) return null;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark text-white relative flex flex-col font-sans">
        <Routes>
          <Route 
            path="/login" 
            element={
              role === 'auth' ? (
                <AuthModule setRole={setRole} />
              ) : (
                <Navigate to={`/${role}`} replace />
              )
            } 
          />
          <Route 
            path="/passenger" 
            element={
              role === 'passenger' ? <PassengerModule /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/driver" 
            element={
              role === 'driver' ? <DriverModule /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/admin" 
            element={
              role === 'admin' ? <AdminModule /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={role === 'auth' ? "/login" : `/${role}`} replace />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
