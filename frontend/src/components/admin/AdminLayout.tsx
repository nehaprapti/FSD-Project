import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Car, Users, Shield, BarChart3, Settings, DollarSign, LogOut, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Car, label: "Rides", path: "/admin/rides" },
  { icon: Users, label: "Drivers", path: "/admin/verification" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: CheckSquare, label: "Verification", path: "/admin/verification" },
  { icon: DollarSign, label: "Pricing", path: "/admin/dashboard" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/dashboard" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#222222] flex flex-col flex-shrink-0 fixed h-full z-30">
        <div className="p-5">
          <h1 className="text-y-primary font-extrabold text-xl text-metric">
            RapidX
          </h1>
          <span className="inline-block bg-y-primary/15 text-y-primary text-[10px] font-bold rounded-pill px-2 py-0.5 mt-1">Admin</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-input text-sm transition-colors text-left",
                  active ? "bg-y-primary text-y-dark font-semibold" : "text-rx-gray-400 hover:bg-[#333]"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#333]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rx-gray-700 flex items-center justify-center text-white text-xs font-bold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">Admin User</p>
            </div>
            <button onClick={() => navigate("/admin/login")}><LogOut size={16} className="text-rx-gray-400 hover:text-white" /></button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-[240px] bg-off-white min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
