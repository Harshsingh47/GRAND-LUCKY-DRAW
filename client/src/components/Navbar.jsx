import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Crown,
  Sparkles,
  User,
  ShieldCheck,
  Menu,
  X,
  Award,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { participant, isParticipantLoggedIn, logoutParticipant, isAdminLoggedIn, adminUser } =
    useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Prizes', path: '/prizes', badge: '70' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Draw Info', path: '/draw-information' },
    { name: 'Winners', path: '/winners' },
    { name: 'Verify Pass', path: '/verify-winner' },
    { name: 'FAQ', path: '/faq' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#E8EAF0]/90 shadow-[0_4px_25px_rgba(15,23,42,0.04)]">
      {/* Golden Top Hairline Accent */}
      <div className="h-[2px] bg-gradient-to-r from-[#D4AF37]/20 via-[#F0C75E] to-[#D4AF37]/20 w-full" />

      {/* Micro Announcement Header Strip */}
      <div className="bg-gradient-to-r from-[#FAF8F5] via-[#FDFBF7] to-[#FAF8F5] border-b border-[#E8EAF0]/80 py-1.5 px-4 text-[11px] text-center text-[#5A657D]">
        <span className="inline-flex items-center gap-1.5 text-[#8C610A] font-black uppercase tracking-wider font-display">
          <Crown className="w-3 h-3 text-[#D4AF37]" />
          Official 2027 Gala:
        </span>{' '}
        <span className="text-[#0F172A] font-semibold">
          70 Listed Grand Rewards • 100% Offline Physical Manual Draw
        </span>
        {isAdminLoggedIn && (
          <Link
            to="/admin/dashboard"
            className="ml-3 text-[#B8860B] underline font-bold hover:text-[#946708]"
          >
            [Admin Panel: {adminUser?.role}]
          </Link>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Royal Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5D061] via-[#D4AF37] to-[#996515] p-0.5 shadow-gold-glow flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#FBF5B7] group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-[#8C610A] font-black font-display leading-tight">
                Dream Big • Win Big
              </div>
              <div className="text-lg sm:text-xl font-black tracking-tight text-[#0F172A] font-display leading-tight">
                GRAND <span className="text-gold-gradient text-gold-glow">LUCKY DRAW</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-bold font-heading transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'text-[#8C610A] bg-gradient-to-b from-[#FAF7EE] to-[#F3E5C1]/40 border border-[#D4AF37]/50 shadow-xs font-black scale-102'
                      : 'text-[#5A657D] hover:text-[#0F172A] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold transition-colors ${
                        active
                          ? 'bg-[#8C610A] text-white'
                          : 'bg-[#FAF7EE] text-[#8C610A] border border-[#D4AF37]/40'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {isParticipantLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/participant/dashboard"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FAF7EE] to-[#F3E5C1]/40 border border-[#D4AF37]/50 text-[#0F172A] text-xs font-bold hover:shadow-card-hover transition-all shadow-xs font-heading"
                >
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{participant?.fullName?.split(' ')[0] || 'My Pass'}</span>
                  <span className="text-[11px] bg-[#D4AF37]/20 px-2 py-0.5 rounded text-[#8C610A] font-mono font-bold">
                    {participant?.participantId || 'Pass'}
                  </span>
                </Link>
                <button
                  onClick={logoutParticipant}
                  title="Logout"
                  className="p-2 rounded-xl text-[#5A657D] hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-[#5A657D] hover:text-[#0F172A] hover:bg-[#FAF8F5] rounded-xl transition-all font-heading"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-gold-glow font-heading whitespace-nowrap hover:scale-[1.02] transition-transform"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
                  <span>Join Free</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#0F172A] hover:text-[#D4AF37] hover:bg-[#FAF8F5] transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-[#E8EAF0] px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all font-heading ${
                  active
                    ? 'text-[#8C610A] bg-[#FAF7EE] border border-[#D4AF37]/50 shadow-xs'
                    : 'text-[#5A657D] hover:text-[#0F172A] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FAF7EE] text-[#8C610A] border border-[#D4AF37]/40">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-[#E8EAF0] flex flex-col gap-2.5">
            {isParticipantLoggedIn ? (
              <>
                <Link
                  to="/participant/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-[#FAF7EE] border border-[#D4AF37]/40 text-[#0F172A] text-sm font-bold flex items-center justify-center gap-2 font-heading"
                >
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span>Dashboard ({participant?.participantId})</span>
                </Link>
                <button
                  onClick={() => {
                    logoutParticipant();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2 px-4 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold font-heading"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-gold w-full text-center py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 font-heading shadow-gold-glow"
                >
                  <Sparkles className="w-4 h-4 text-[#0F172A]" />
                  <span>Join Free — Register Now</span>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-outline-gold w-full text-center py-2.5 rounded-xl text-xs font-bold font-heading"
                >
                  Login to Portal
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
