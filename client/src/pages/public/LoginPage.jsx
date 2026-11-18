import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Crown, KeyRound, Phone, Mail, Lock, ShieldCheck, ArrowRight, User } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginParticipant, loginAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('participant'); // 'participant' or 'admin'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Participant State
  const [identifier, setIdentifier] = useState('');

  // Admin State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);

  // Participant: Direct Login without OTP
  const handleParticipantDirectLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      return setErrorMsg('Please enter your registered mobile number or Participant ID');
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/participant/login', {
        identifier: identifier.trim()
      });

      if (res.data.success) {
        loginParticipant(res.data.token, res.data.participant);
        showToast(`Welcome back, ${res.data.participant.fullName}!`, 'success');
        navigate('/participant/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Participant not found. Please check your mobile or Participant ID.');
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Admin: Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      return setErrorMsg('Please enter both admin email and password');
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/admin/login', {
        email: adminEmail.trim(),
        password: adminPassword,
        twoFactorCode: twoFactorCode.trim() || undefined
      });

      if (res.data.requires2FA) {
        setRequires2FA(true);
        showToast('Please enter your 2FA verification code', 'info');
        setLoading(false);
        return;
      }

      if (res.data.success) {
        loginAdmin(res.data.token, res.data.user);
        showToast(`Logged in as ${res.data.user.name} (${res.data.user.role})`, 'success');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid admin credentials');
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-20">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-xs font-bold text-[#946708] uppercase tracking-wider shadow-xs">
          <Crown className="w-4 h-4 text-[#D6A63A]" />
          <span>Official Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#172033]">
          PORTAL <span className="text-gold-gradient">ACCESS</span>
        </h1>
        <p className="text-sm text-[#667085]">
          Login using your registered credentials to access your dashboard.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-white border border-[#E8EAF0] shadow-xs mb-8">
        <button
          onClick={() => {
            setActiveTab('participant');
            setErrorMsg('');
          }}
          className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'participant'
              ? 'bg-gradient-to-r from-[#DFBA5E] to-[#D6A63A] text-[#172033] shadow-gold-glow'
              : 'text-[#667085] hover:text-[#172033]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Participant Login</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('admin');
            setErrorMsg('');
          }}
          className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'admin'
              ? 'bg-gradient-to-r from-[#DFBA5E] to-[#D6A63A] text-[#172033] shadow-gold-glow'
              : 'text-[#667085] hover:text-[#172033]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* TAB 1: PARTICIPANT DIRECT LOGIN */}
      {activeTab === 'participant' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EAF0] shadow-card-light">
          <form onSubmit={handleParticipantDirectLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D6A63A]" />
                <span>Registered Mobile Number or Participant ID</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 9810123456 or LD2027-000001"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] font-mono text-base focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
              />
              <span className="text-[11px] text-[#667085] block font-medium">
                Instant direct access. Enter your registered 10-digit mobile number or unique ID.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-gold-glow"
            >
              {loading ? 'Accessing Dashboard...' : 'Login to Participant Portal'}
              <ArrowRight className="w-4 h-4 text-[#172033]" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#667085]">
                Not registered yet?{' '}
                <Link to="/register" className="text-[#B8860B] font-bold underline">
                  Register for Free
                </Link>
              </span>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ADMIN PORTAL LOGIN */}
      {activeTab === 'admin' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EAF0] shadow-card-light space-y-6">
          {/* Quick preset credential buttons for test convenience */}
          <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#D6A63A]/30 text-xs text-[#172033] space-y-2">
            <span className="text-[#946708] font-bold uppercase tracking-wider block">Demo Authorized Accounts:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@grandluckydraw.com');
                  setAdminPassword('Password@123');
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#D6A63A]/40 text-[#946708] font-semibold hover:bg-[#F3E5C1]/40 text-xs shadow-xs"
              >
                Fill Superadmin (Director)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('officer@grandluckydraw.com');
                  setAdminPassword('Password@123');
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#D6A63A]/40 text-[#946708] font-semibold hover:bg-[#F3E5C1]/40 text-xs shadow-xs"
              >
                Fill Secondary Admin (Draw Officer)
              </button>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D6A63A]" />
                <span>Admin Email Address</span>
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@grandluckydraw.com"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#D6A63A]" />
                <span>Admin Password</span>
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
              />
            </div>

            {requires2FA && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#B8860B] flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#D6A63A]" />
                  <span>Two-Factor Authentication Code (2FA)</span>
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="Enter 6-digit code or 123456"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[#F8F9FC] border-2 border-[#D6A63A] text-[#172033] text-sm font-mono focus:bg-white focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-gold-glow"
            >
              <ShieldCheck className="w-4 h-4 text-[#172033]" />
              <span>{loading ? 'Authenticating...' : 'Secure Admin Login'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
