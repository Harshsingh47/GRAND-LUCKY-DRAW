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
    <header className="sticky top-0 z-40 bg-[#070709]/90 backdrop-blur-xl border-b border-gold-500/20">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-dark-950 via-dark-850 to-dark-950 border-b border-gold-500/10 py-1.5 px-4 text-xs text-center text-gray-300">
        <span className="inline-flex items-center gap-1.5 text-gold-400 font-semibold tracking-wide uppercase">
          <Crown className="w-3.5 h-3.5 text-gold-400" />
          Independent Medias Presents:
        </span>{' '}
        <span className="text-gray-200">Grand Lucky Draw 2027 — 70 Listed Prizes • 100% Offline Manual Draw</span>
        {isAdminLoggedIn && (
          <Link to="/admin/dashboard" className="ml-3 text-gold-400 underline font-semibold hover:text-gold-300">
            [Admin Panel: {adminUser?.role}]
          </Link>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 p-0.5 shadow-gold-glow flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0B0B0E] rounded-[10px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-gold-400 group-hover:text-gold-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-gold-400/90 font-medium">Independent Medias</div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-wide text-gold-gradient font-heading">
                GRAND LUCKY DRAW
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-gold-400 bg-gold-500/10 border border-gold-500/30'
                    : 'text-gray-300 hover:text-gold-300 hover:bg-white/5'
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/15 border border-gold-500/40 text-gold-300 text-sm font-semibold hover:bg-gold-500/25 transition-all"
                >
                  <User className="w-4 h-4 text-gold-400" />
                  <span>{participant?.fullName?.split(' ')[0] || 'My Pass'}</span>
                  <span className="text-xs bg-gold-500/30 px-2 py-0.5 rounded text-gold-200 font-mono">
                    {participant?.participantId || 'Pass'}
                  </span>
                </Link>
                <button
                  onClick={logoutParticipant}
                  title="Logout"
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-gold-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gold px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-gold-glow"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Join Now</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-gold-400 hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#0C0D11] border-b border-gold-500/20 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 text-base font-medium rounded-lg ${
                isActive(link.path)
                  ? 'text-gold-400 bg-gold-500/10 border border-gold-500/30'
                  : 'text-gray-300 hover:text-gold-300 hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-800 flex flex-col gap-2">
            {isParticipantLoggedIn ? (
              <>
                <Link
                  to="/participant/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 font-semibold"
                >
                  Dashboard ({participant?.participantId})
                </Link>
                <button
                  onClick={() => {
                    logoutParticipant();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2 px-4 rounded-lg text-red-400 hover:bg-red-500/10 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-gold w-full text-center py-3 rounded-lg font-bold"
                >
                  Join Now — Register Free
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-outline-gold w-full text-center py-2.5 rounded-lg text-sm"
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
