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
    <div className="min-h-screen bg-[#070709] text-gray-200 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0B0C10] border-r border-gold-500/20 shrink-0">
        {/* Brand Banner */}
        <div className="p-5 border-b border-gold-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-700 p-0.5 flex items-center justify-center shadow-gold-glow">
            <div className="w-full h-full bg-[#0B0B0E] rounded-[10px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Grand Lucky Draw</div>
            <div className="text-base font-bold text-white font-heading">ADMIN COMMAND</div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item, idx) => {
            if (item.type === 'divider') {
              return (
                <div key={idx} className="pt-4 pb-1 px-3 text-[10px] font-bold tracking-widest text-gold-400/80 uppercase">
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
                    ? 'bg-gradient-to-r from-gold-500/20 to-gold-500/5 text-gold-300 border border-gold-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gold-500/30 text-gold-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User profile & Logout footer */}
        <div className="p-4 border-t border-gold-500/20 bg-[#090A0D]">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <div className="text-sm font-bold text-white truncate">{adminUser?.name || 'Administrator'}</div>
              <div className="text-xs text-gold-400 capitalize font-mono">Role: {adminUser?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <Link to="/" target="_blank" className="hover:text-gold-400 flex items-center gap-1">
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
        <header className="h-16 bg-[#0B0C10] border-b border-gold-500/20 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-gold-400 font-semibold">Admin</span>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-white capitalize font-medium">
                {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300">
              <Crown className="w-3.5 h-3.5 text-gold-400" />
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 bg-[#0B0C10] border-r border-gold-500/30 flex flex-col h-full z-10">
            <div className="p-4 border-b border-gold-500/20 flex items-center justify-between">
              <div className="text-sm font-bold text-gold-400 font-heading">ADMIN MENU</div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item, idx) => {
                if (item.type === 'divider') {
                  return (
                    <div key={idx} className="pt-3 pb-1 px-3 text-[10px] font-bold text-gold-400/80 uppercase">
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
                      isActive(item.path) ? 'bg-gold-500/20 text-gold-300' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-gold-400" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-gold-500/20">
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-lg bg-red-500/20 text-red-300 text-sm font-semibold"
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
