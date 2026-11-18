import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Gift,
  Calendar,
  Lock,
  UserCheck,
  CheckSquare,
  Award,
  FileText,
  Bell,
  BarChart3,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logoutAdmin } = useAuth();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Participant Management', path: '/admin/participants', icon: Users },
    { name: 'Prize Catalogue (70)', path: '/admin/prizes', icon: Gift },
    { name: 'Campaign Settings', path: '/admin/campaigns', icon: Calendar },
    { type: 'divider', label: 'MANUAL DRAW MODULE' },
    { name: 'Draw Management (Freeze)', path: '/admin/draw-management', icon: Lock, highlight: true },
    { name: 'Enter Winners', path: '/admin/enter-winners', icon: UserCheck },
    { name: 'Winner Approvals (2-Step)', path: '/admin/winner-approvals', icon: CheckSquare, badge: 'Dual Admin' },
    { name: 'Published Winners', path: '/admin/winners', icon: Award },
    { name: 'Prize Claims & KYC', path: '/admin/prize-claims', icon: FileText },
    { type: 'divider', label: 'SYSTEM & LOGS' },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell },
    { name: 'Reports & Exports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Audit Trail', path: '/admin/audit-logs', icon: ShieldAlert },
    { name: 'System Settings', path: '/admin/settings', icon: Settings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#172033] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-[#E8EAF0] shrink-0 shadow-sm">
        {/* Brand Banner */}
        <div className="p-5 border-b border-[#E8EAF0] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6A63A] to-[#B8860B] p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-[#172033] rounded-[10px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#FAF7EE]" />
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#946708] font-bold">Grand Lucky Draw</div>
            <div className="text-base font-black text-[#172033] font-heading">ADMIN COMMAND</div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item, idx) => {
            if (item.type === 'divider') {
              return (
                <div key={idx} className="pt-4 pb-1 px-3 text-[10px] font-bold tracking-widest text-[#946708] uppercase">
                  {item.label}
                </div>
              );
            }
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#FAF7EE] text-[#946708] border border-[#D6A63A]/40 font-bold shadow-sm'
                    : 'text-[#667085] hover:text-[#172033] hover:bg-[#F8F9FC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#D6A63A]' : 'text-[#667085]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAF7EE] text-[#946708] border border-[#D6A63A]/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User profile & Logout footer */}
        <div className="p-4 border-t border-[#E8EAF0] bg-white">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <div className="text-sm font-bold text-[#172033] truncate">{adminUser?.name || 'Administrator'}</div>
              <div className="text-xs text-[#946708] capitalize font-mono">Role: {adminUser?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-[#667085] hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E8EAF0] flex items-center justify-between text-xs text-[#667085]">
            <Link to="/" target="_blank" className="hover:text-[#172033] flex items-center gap-1 font-medium">
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span>v1.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E8EAF0] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-[#667085] hover:text-[#172033] lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-sm text-[#667085]">
              <span className="text-[#946708] font-bold">Admin</span>
              <ChevronRight className="w-4 h-4 text-[#667085]/60" />
              <span className="text-[#172033] capitalize font-semibold">
                {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/30 text-xs text-[#946708] font-semibold">
              <Crown className="w-3.5 h-3.5 text-[#D6A63A]" />
              <span>Grand Lucky Draw Control Suite</span>
            </div>
            <Link
              to="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg btn-outline-gold text-xs font-semibold flex items-center gap-1"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Dynamic Route Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8F9FC]">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-[#172033]/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 bg-white border-r border-[#E8EAF0] flex flex-col h-full z-10 shadow-2xl">
            <div className="p-4 border-b border-[#E8EAF0] flex items-center justify-between">
              <div className="text-sm font-bold text-[#172033] font-heading">ADMIN MENU</div>
              <button onClick={() => setSidebarOpen(false)} className="text-[#667085] hover:text-[#172033]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item, idx) => {
                if (item.type === 'divider') {
                  return (
                    <div key={idx} className="pt-3 pb-1 px-3 text-[10px] font-bold text-[#946708] uppercase">
                      {item.label}
                    </div>
                  );
                }
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      isActive(item.path) ? 'bg-[#FAF7EE] text-[#946708] font-bold' : 'text-[#667085] hover:text-[#172033]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#D6A63A]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-[#E8EAF0]">
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
