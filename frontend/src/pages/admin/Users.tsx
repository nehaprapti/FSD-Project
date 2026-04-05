import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatusPill from "@/components/shared/StatusPill";
import { Search, MoreHorizontal, X, AlertTriangle, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const userTabs = ["All Users", "Passengers", "Drivers"];

const users = [
  { id: 1, name: "Arjun Mehta", email: "arjun@email.com", role: "Passenger", joined: "Mar 15, 2024", rides: 47, status: "online" as const },
  { id: 2, name: "Priya Sharma", email: "priya@email.com", role: "Passenger", joined: "Feb 20, 2024", rides: 23, status: "online" as const },
  { id: 3, name: "Ravi Kumar", email: "ravi@email.com", role: "Driver", joined: "Jan 10, 2024", rides: 1247, status: "online" as const },
  { id: 4, name: "Suresh M", email: "suresh@email.com", role: "Driver", joined: "Mar 01, 2024", rides: 89, status: "offline" as const },
  { id: 5, name: "Deepa V", email: "deepa@email.com", role: "Passenger", joined: "Mar 22, 2024", rides: 8, status: "rejected" as const },
];

const AdminUsers: React.FC = () => {
  const [tab, setTab] = useState("All Users");
  const [search, setSearch] = useState("");
  const [blockUser, setBlockUser] = useState<typeof users[0] | null>(null);
  const [detailUser, setDetailUser] = useState<typeof users[0] | null>(null);

  const filtered = users.filter(u => {
    if (tab === "Passengers" && u.role !== "Passenger") return false;
    if (tab === "Drivers" && u.role !== "Driver") return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-rx-black mb-6">Users</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rx-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full h-11 bg-white rounded-input pl-11 pr-4 text-sm text-rx-black outline-none border border-rx-gray-100 focus:border-y-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-rx-gray-100 mb-4">
          {userTabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-medium ${tab === t ? "text-rx-black border-b-2 border-y-primary font-bold" : "text-rx-gray-400"}`}>{t}</button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-label text-rx-gray-400 border-b border-rx-gray-100">
                <th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Joined</th><th className="p-4">Total Rides</th><th className="p-4">Status</th><th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-rx-gray-100 last:border-0 hover:bg-y-surface/30 cursor-pointer" onClick={() => u.role === "Driver" && setDetailUser(u)}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rx-gray-100 flex items-center justify-center text-rx-gray-700 font-bold text-xs">{u.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-rx-black">{u.name}</p>
                        <p className="text-xs text-rx-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold rounded-pill px-2.5 py-1 ${u.role === "Driver" ? "bg-carbon text-y-primary" : "bg-rx-gray-100 text-rx-gray-700"}`}>{u.role}</span>
                  </td>
                  <td className="p-4 text-sm text-rx-gray-700">{u.joined}</td>
                  <td className="p-4 text-sm font-medium text-rx-black">{u.rides}</td>
                  <td className="p-4"><StatusPill status={u.status === "rejected" ? "rejected" : u.status} /></td>
                  <td className="p-4">
                    <button onClick={e => { e.stopPropagation(); setBlockUser(u); }} className="p-1.5 hover:bg-rx-gray-100 rounded">
                      <MoreHorizontal size={16} className="text-rx-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block modal */}
      {blockUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-modal p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-danger/10 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-danger" />
            </div>
            <h2 className="text-xl font-bold text-rx-black">Block this user?</h2>
            <p className="text-rx-gray-400 text-sm mt-2">{blockUser.name} will not be able to log in or book rides.</p>
            <div className="flex gap-3 mt-6">
              <Button variant="outline-gray" className="flex-1" onClick={() => setBlockUser(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={() => setBlockUser(null)}>Block User</Button>
            </div>
          </div>
        </div>
      )}

      {/* Driver detail sidebar */}
      {detailUser && (
        <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-rx-black">Driver Details</h2>
              <button onClick={() => setDetailUser(null)}><X size={20} className="text-rx-gray-400" /></button>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-rx-gray-100 mx-auto flex items-center justify-center text-rx-gray-700 font-bold text-xl">{detailUser.name[0]}</div>
              <h3 className="font-bold text-rx-black text-lg mt-2">{detailUser.name}</h3>
              <StatusPill status="approved" className="mt-1" />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center bg-off-white rounded-[12px] p-3">
                <p className="font-bold text-rx-black">{detailUser.rides}</p>
                <p className="text-label text-rx-gray-400">Trips</p>
              </div>
              <div className="text-center bg-off-white rounded-[12px] p-3">
                <p className="font-bold text-y-primary">4.8 ★</p>
                <p className="text-label text-rx-gray-400">Rating</p>
              </div>
              <div className="text-center bg-off-white rounded-[12px] p-3">
                <p className="font-bold text-green-success">₹3.2L</p>
                <p className="text-label text-rx-gray-400">Earned</p>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              {["License", "ID Proof", "Registration", "Insurance"].map(doc => (
                <div key={doc} className="flex items-center justify-between py-2 border-b border-rx-gray-100">
                  <span className="text-sm text-rx-gray-700">{doc}</span>
                  <StatusPill status="approved" />
                </div>
              ))}
            </div>
            <Button className="w-full">View Full Profile</Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
