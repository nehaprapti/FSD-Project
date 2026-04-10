import React, { useState, useEffect } from 'react';
import { GlassCard, Button } from '../../components/UI';
import { Search, MoreVertical, Trash2, Loader2 } from 'lucide-react';
import * as adminApi from '../../api/admin';

export const UserManagement = () => {
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
