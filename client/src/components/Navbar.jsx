import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Sparkles, User, ShieldCheck, Menu, X, Award, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { participant, isParticipantLoggedIn, logoutParticipant, isAdminLoggedIn, adminUser } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Prizes (70)', path: '/prizes' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Draw Info', path: '/draw-information' },
    { name: 'Official Winners', path: '/winners' },
    { name: 'Verify & Claim', path: '/verify-winner' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8EAF0] shadow-sm">
      {/* Top micro announcement bar */}
      <div className="bg-[#FAF7EE] border-b border-[#E8EAF0] py-2 px-4 text-xs text-center text-[#0F172A]">
        <span className="inline-flex items-center gap-1.5 text-[#8C610A] font-black tracking-widest uppercase font-display">
          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
          Official Campaign 2027:
        </span>{' '}
        <span className="text-[#0F172A] font-semibold">Grand Lucky Draw — 70 Listed Prizes • 100% Offline Manual Draw</span>
        {isAdminLoggedIn && (
          <Link to="/admin/dashboard" className="ml-3 text-[#B8860B] underline font-bold hover:text-[#946708]">
            [Admin Panel: {adminUser?.role}]
          </Link>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F0C75E] via-[#D8A738] to-[#B88214] p-0.5 shadow-gold-glow flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#FBF5B7] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#9E7012] font-black font-display">Dream Big... Win Big...</div>
              <div className="text-xl sm:text-2xl font-black tracking-wider text-[#0F172A] font-display">
                GRAND <span className="text-gold-gradient">LUCKY DRAW</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 text-sm font-bold rounded-xl transition-all duration-200 font-heading ${
                  isActive(link.path)
                    ? 'text-[#8C610A] bg-[#FAF7EE] border border-[#D4AF37]/50 shadow-xs'
                    : 'text-[#5A657D] hover:text-[#0F172A] hover:bg-[#FAF8F5]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {isParticipantLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/participant/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7EE] border border-[#D4AF37]/40 text-[#0F172A] text-sm font-bold hover:bg-[#F3E5C1]/50 transition-all shadow-xs"
                >
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span>{participant?.fullName?.split(' ')[0] || 'My Pass'}</span>
                  <span className="text-xs bg-[#D4AF37]/20 px-2 py-0.5 rounded text-[#8C610A] font-mono font-bold">
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
                  className="px-3.5 py-2 text-sm font-bold text-[#5A657D] hover:text-[#0F172A] transition-colors font-heading"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gold px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-gold-glow font-heading"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
                  <span>Join Now Free</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#172033] hover:text-[#D6A63A] hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8EAF0] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 text-base font-semibold rounded-lg ${
                isActive(link.path)
                  ? 'text-[#B8860B] bg-[#FAF7EE] border border-[#D6A63A]/30'
                  : 'text-[#667085] hover:text-[#172033] hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#E8EAF0] flex flex-col gap-2">
            {isParticipantLoggedIn ? (
              <>
                <Link
                  to="/participant/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#172033] font-semibold"
                >
                  Dashboard ({participant?.participantId})
                </Link>
                <button
                  onClick={() => {
                    logoutParticipant();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2 px-4 rounded-lg text-red-500 hover:bg-red-50 text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-gold w-full text-center py-3 rounded-xl font-bold"
                >
                  Join Now — Register Free
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-outline-gold w-full text-center py-2.5 rounded-xl text-sm"
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
