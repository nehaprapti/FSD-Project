import React, { useState, useEffect } from 'react';
import { ScreenTransition, GlassCard, Button } from './UI';
import { LayoutDashboard, XCircle, X , AlertCircle, Users, FileCheck, DollarSign, MessageSquare, Search, MoreVertical, ShieldAlert, CheckCircle, LogOut, Loader2, Trash2, Eye } from 'lucide-react';
import * as adminApi from '../api/admin';

export const AdminModule = () => {
  const [screen, setScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const renderScreen = () => {
    switch(screen) {
      case 'dashboard': return <AdminDashboard user={user} />;
      case 'users': return <UserManagement />;
      case 'verification': return <DriverVerificationPanel />;
      case 'revenue': return <RevenuePanel />;
      case 'complaints': return <ComplaintsSystem />;
      default: return <AdminDashboard user={user} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'verification', icon: FileCheck, label: 'Verification' },
    { id: 'revenue', icon: DollarSign, label: 'Revenue' },
    { id: 'complaints', icon: MessageSquare, label: 'Complaints' }
  ];

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
              onClick={() => setScreen(item.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${screen === item.id ? 'bg-primary/10 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={20} className="shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
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
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-full text-white/70">
              <LayoutDashboard size={20} />
            </button>
            <h2 className="font-semibold text-lg">
              Good Morning, {user.name || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white/70">{user.email || 'admin@example.com'}</div>
            <div className="w-8 h-8 bg-primary/20 border border-primary/50 rounded-full flex items-center justify-center text-primary text-xs font-bold">
              {user.name?.[0] || 'A'}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <ScreenTransition keyId={screen}>
            {renderScreen()}
          </ScreenTransition>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ user }: { user: any }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAdminDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-white/50">Welcome back, {user.name || 'Admin'}. Here's what's happening today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: stats?.totalUsers || '0', change: '+0%' },
          { label: 'Active Rides', value: stats?.ongoingRides || '0', change: '+0%' },
          { label: 'Revenue (Total)', value: `$${stats?.totalRevenue || '0'}`, change: '+0%' },
          { label: 'Drivers Online', value: stats?.activeDriversNow || '0', change: '+0%' }
        ].map((kpi, i) => (
          <GlassCard key={i}>
            <div className="text-white/50 text-sm mb-2">{kpi.label}</div>
            <div className="text-3xl font-bold text-white mb-2">{kpi.value}</div>
            <div className={`text-sm ${kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{kpi.change} this week</div>
          </GlassCard>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-bold mb-4">Daily Rides</h3>
          <div className="flex-1 flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 60, 110, 85, 100, 120, 95].map((h, i) => (
              <div key={i} className="w-full bg-white/10 rounded-t-sm relative group">
                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-bold mb-4">Demand Heatmap</h3>
          <div className="flex-1 bg-linear-to-r from-transparent bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[20px_20px] rounded-xl relative overflow-hidden">
            <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-red-500/40 blur-2xl rounded-full" />
            <div className="absolute top-[50%] left-[60%] w-40 h-40 bg-primary/40 blur-2xl rounded-full" />
            <div className="absolute top-[70%] left-[20%] w-24 h-24 bg-green-500/40 blur-2xl rounded-full" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<'passengers' | 'drivers'>('passengers');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    const role = activeTab === 'passengers' ? 'passenger' : 'driver';
    adminApi.getUsers({ role })
      .then(data => {
        setUsers(data.items || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleDelete = async (userId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete user ${name}? This action cannot be undone.`)) {
      try {
        await adminApi.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex bg-black/40 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('passengers')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'passengers' ? 'bg-primary text-black' : 'text-white/70 hover:text-white'}`}
          >
            Passengers
          </button>
          <button 
            onClick={() => setActiveTab('drivers')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'drivers' ? 'bg-primary text-black' : 'text-white/70 hover:text-white'}`}
          >
            Drivers
          </button>
        </div>
      </div>
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input type="text" placeholder={`Search ${activeTab}...`} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none" />
          </div>
          <Button variant="outline" className="py-2">Filter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-sm">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-2" size={24} />
                    <span className="text-white/50">Loading users...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/50">
                    No {activeTab} found.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 flex items-center gap-3 text-nowrap">
                      <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                        {u.name?.[0] || 'U'}
                      </div>
                      <span className="font-medium">{u.name || u.username}</span>
                    </td>
                    <td className="p-4 text-sm text-white/70">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {u.status || 'Verified'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/70 text-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-white/50 hover:text-white transition-colors">
                          <MoreVertical size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(u._id, u.name || u.username)}
                          className="text-red-400/50 hover:text-red-400 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

const DriverVerificationPanel = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionDriverId, setRejectionDriverId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const fetchQueue = () => {
    setLoading(true);
    adminApi.getVerificationQueue()
      .then(setQueue)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (driverId: string) => {
    try {
      await adminApi.approveVerification(driverId);
      fetchQueue();
    } catch (err) {
      alert("Failed to approve verification.");
    }
  };

  const handleReject = async () => {
    if (!rejectionDriverId || !reason) return;
    setRejecting(true);
    try {
      await adminApi.rejectVerification(rejectionDriverId, reason);
      setRejectionDriverId(null);
      setReason("");
      fetchQueue();
    } catch (err) {
      alert("Failed to reject verification.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Verifications</h1>

      {rejectionDriverId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <GlassCard className="w-full max-w-md animate-in zoom-in-95 duration-200 border-red-500/30">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={20} />
                <h3 className="font-bold">Rejection Reason</h3>
              </div>
              <button 
                onClick={() => setRejectionDriverId(null)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-white/50 mb-4">
              Please provide a clear reason why this driver application is being rejected. This will be shown on their dashboard.
            </p>

            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none transition-all h-32 mb-6"
              placeholder="e.g. Driver License photo is blurry or expired..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setRejectionDriverId(null)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none"
                onClick={handleReject}
                disabled={!reason || rejecting}
              >
                {rejecting ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : queue.length === 0 ? (
        <GlassCard className="py-12 text-center text-white/50">
          No pending verifications found.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queue.map(item => (
            <GlassCard key={item.driverId} className="flex flex-col animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                  {item.driver?.name?.[0] || 'D'}
                </div>
                <div>
                  <h3 className="font-bold">{item.driver?.name || 'Unknown Driver'}</h3>
                  <p className="text-sm text-white/50">Applied {new Date(item.documents[0]?.uploadedAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6 flex-1">
                {item.documents.map((doc: any) => (
                  <div key={doc.documentType} className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                    <span className="text-sm text-white/70 capitalize">{doc.documentType.replace('_', ' ')}</span>
                    <div className="flex gap-2 items-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${doc.status === 'approved' ? 'bg-green-500/20 text-green-400' : doc.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {doc.status}
                      </span>
                      <a 
                        href={`http://localhost:5000${doc.fileRef}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary text-xs hover:underline flex items-center gap-1"
                      >
                        <Eye size={12} /> View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="danger" className="flex-1 py-2" onClick={() => { setRejectionDriverId(item.driverId); setReason(""); }}><XCircle size={16} /> Reject</Button>
                <Button className="flex-1 py-2" onClick={() => handleApprove(item.driverId)}><CheckCircle size={16} /> Approve</Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

const RevenuePanel = () => (
  <div className="max-w-6xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Revenue & Payouts</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <GlassCard className="lg:col-span-2 flex flex-col justify-center items-center py-12">
        <div className="text-white/50 mb-2">Total Platform Revenue</div>
        <div className="text-5xl font-bold text-primary mb-4">$142,500</div>
        <div className="flex gap-8 text-sm">
          <div className="text-center">
            <div className="text-white/50">Driver Payouts (80%)</div>
            <div className="font-bold text-white">$114,000</div>
          </div>
          <div className="text-center">
            <div className="text-white/50">Platform Fee (20%)</div>
            <div className="font-bold text-green-400">$28,500</div>
          </div>
        </div>
      </GlassCard>
      <GlassCard>
        <h3 className="font-bold mb-4">Pending Payouts</h3>
        <div className="text-3xl font-bold mb-6">$12,450</div>
        <Button className="w-full">Process Payouts</Button>
      </GlassCard>
    </div>
  </div>
);

const ComplaintsSystem = () => (
  <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex gap-6">
    <GlassCard className="w-1/3 flex flex-col p-0 overflow-hidden">
      <div className="p-4 border-b border-white/10 font-bold">Open Tickets</div>
      <div className="flex-1 overflow-y-auto">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 ${i === 1 ? 'bg-white/5 border-l-2 border-l-primary' : ''}`}>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-sm">Ticket #{1000+i}</span>
              <span className="text-xs text-red-400">High</span>
            </div>
            <div className="text-sm text-white/70 truncate">Driver was very rude and...</div>
            <div className="text-xs text-white/40 mt-2">2 hours ago</div>
          </div>
        ))}
      </div>
    </GlassCard>
    <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <div className="font-bold">Ticket #1001</div>
          <div className="text-sm text-white/50">Reported by: Passenger Aathi</div>
        </div>
        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">Open</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        <div className="bg-white/5 p-3 rounded-xl rounded-tl-none max-w-[80%] self-start text-sm">
          The driver was very rude and drove recklessly. I felt unsafe.
        </div>
        <div className="bg-primary/20 text-primary p-3 rounded-xl rounded-tr-none max-w-[80%] self-end text-sm">
          We apologize for the experience. We are investigating this immediately.
        </div>
      </div>
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input type="text" placeholder="Type a reply..." className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        <Button className="py-2 px-6">Send</Button>
      </div>
    </GlassCard>
  </div>
);
