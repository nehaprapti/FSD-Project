import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ScreenTransition } from "../components/UI";
import {
  Home,
  DollarSign,
  User,
  FileText,
  LogOut,
} from "lucide-react";

import { DriverDashboard } from "../sections/driver/DriverDashboard";
import { RideRequestPopup } from "../sections/driver/RideRequestPopup";
import { NavigationScreen } from "../sections/driver/NavigationScreen";
import { RideActive } from "../sections/driver/RideActive";
import { EarningsPage } from "../sections/driver/EarningsPage";
import { DriverVerification } from "../sections/driver/DriverVerification";
import { DriverProfile } from "../sections/driver/DriverProfile";

export const DriverModule = () => {
  const [showRequest, setShowRequest] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const setScreen = (path: string) => navigate(`/driver/${path}`);
  const currentScreen = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="flex bg-dark h-screen overflow-hidden text-white relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 h-full glass-panel border-y-0 border-l-0 rounded-none flex-col z-50">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(255,214,0,0.4)]">
            D
          </div>
          <span className="text-xl font-black tracking-tight">DriverApp</span>
        </div>

        <div className="flex-1 py-10 px-4 flex flex-col gap-3">
          {[
            { id: "dashboard", icon: Home, label: "Dashboard" },
            { id: "earnings", icon: DollarSign, label: "Earnings" },
            { id: "verification", icon: FileText, label: "Documents" },
            { id: "profile", icon: User, label: "My Profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${currentScreen === item.id || (item.id === 'dashboard' && currentScreen === '') ? "bg-primary text-black font-bold shadow-lg" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
            >
              <item.icon size={22} strokeWidth={currentScreen === item.id ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
          >
            <LogOut size={22} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden glass-panel px-6 py-4 flex justify-between items-center z-40 relative rounded-none border-x-0 border-t-0">
          <div className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
              D
            </div>
            DriverApp
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/5 rounded-full"
          >
            <LogOut size={20} className="text-white/70" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative pb-20 lg:pb-0">
          <ScreenTransition keyId={location.pathname} className="h-full">
            <Routes location={location}>
              <Route path="dashboard" element={<DriverDashboard setScreen={setScreen} setShowRequest={setShowRequest} user={user} />} />
              <Route path="navigation" element={<NavigationScreen setScreen={setScreen} />} />
              <Route path="active" element={<RideActive setScreen={setScreen} />} />
              <Route path="earnings" element={<EarningsPage />} />
              <Route path="verification" element={<DriverVerification />} />
              <Route path="profile" element={<DriverProfile user={user} handleLogout={handleLogout} />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ScreenTransition>
        </div>

        {/* Mobile Navigation (Hidden on Desktop) */}
        <div className="lg:hidden glass-panel absolute bottom-0 left-0 right-0 h-[80px] flex justify-around items-center px-6 z-40 rounded-none border-x-0 border-b-0 pb-safe">
          {[
            { id: "dashboard", icon: Home, label: "Home" },
            { id: "earnings", icon: DollarSign, label: "Earnings" },
            { id: "verification", icon: FileText, label: "Docs" },
            { id: "profile", icon: User, label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentScreen === tab.id || (tab.id === 'dashboard' && currentScreen === '') ? "text-primary" : "text-white/50"}`}
            >
              <tab.icon size={24} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showRequest && (
        <RideRequestPopup
          onAccept={() => {
            setShowRequest(false);
            setScreen("navigation");
          }}
          onReject={() => setShowRequest(false)}
        />
      )}
    </div>
  );
};
