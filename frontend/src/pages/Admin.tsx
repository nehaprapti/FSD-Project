import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ScreenTransition, GlassCard, Button } from '../components/UI';
import { LayoutDashboard, XCircle, X , AlertCircle, Users, FileCheck, DollarSign, MessageSquare, Search, MoreVertical, ShieldAlert, CheckCircle, LogOut, Loader2, Trash2, Eye } from 'lucide-react';
import * as adminApi from '../api/admin';
import { AdminDashboard } from '../sections/admin/AdminDashboard';
import { UserManagement } from '../sections/admin/UserManagement';
import { DriverVerificationPanel } from '../sections/admin/DriverVerificationPanel';
import { RevenuePanel } from '../sections/admin/RevenuePanel';
import { ComplaintsSystem } from '../sections/admin/ComplaintsSystem';

export const AdminModule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'users', icon: Users, label: 'Users', path: '/admin/users' },
    { id: 'verification', icon: FileCheck, label: 'Verification', path: '/admin/verification' },
    { id: 'revenue', icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
    { id: 'complaints', icon: MessageSquare, label: 'Complaints', path: '/admin/complaints' }
  ];

  const currentScreen = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      {/* Sidebar */}
      <div className={`glass-panel border-y-0 border-l-0 rounded-none transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3 h-[72px] border-b border-white/10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold shrink-0">A</div>
          {sidebarOpen && <span className="font-bold text-xl whitespace-nowrap">Admin Panel</span>}
        </div>
        <div className="flex-1 py-6 px-3 flex flex-col gap-2">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${currentScreen === item.id || (item.id === 'dashboard' && currentScreen === '') ? 'bg-primary/10 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={20} className="shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors hidden sm:flex"
            >
              <LogOut size={20} className="shrink-0" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-[72px] glass-panel border-x-0 border-t-0 rounded-none flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-full text-white/70 hidden sm:block">
              <LayoutDashboard size={20} />
            </button>
            <h2 className="font-semibold text-lg hidden sm:block">
              Good Morning, {user.name || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white/70 hidden sm:block">{user.email || 'admin@example.com'}</div>
            <div className="w-8 h-8 bg-primary/20 border border-primary/50 rounded-full flex items-center justify-center text-primary text-xs font-bold">
              {user.name?.[0] || 'A'}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <ScreenTransition keyId={location.pathname}>
            <Routes location={location}>
              <Route path="dashboard" element={<AdminDashboard user={user} />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="verification" element={<DriverVerificationPanel />} />
              <Route path="revenue" element={<RevenuePanel />} />
              <Route path="complaints" element={<ComplaintsSystem />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ScreenTransition>
        </div>
      </div>
    </div>
  );
};


