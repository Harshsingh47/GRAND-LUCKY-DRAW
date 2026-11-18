import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, ShieldCheck, Mail, Lock, KeyRound } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@grandluckydraw.com');
  const [password, setPassword] = useState('Password@123');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/admin/login', {
        email: email.trim(),
        password,
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
        showToast(`Authenticated as ${res.data.user.name} (${res.data.user.role})`, 'success');
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
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E8EAF0] rounded-3xl p-8 sm:p-10 shadow-card-light space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D6A63A] to-[#B8860B] p-0.5 mx-auto flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-[#172033] rounded-[14px] flex items-center justify-center">
              <Crown className="w-7 h-7 text-[#FAF7EE]" />
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-[#946708] font-bold">Grand Lucky Draw</div>
          <h1 className="text-2xl font-black font-heading text-[#172033]">ADMIN COMMAND PORTAL</h1>
          <p className="text-xs text-[#667085]">Authorized personnel access only</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Demo credentials picker */}
        <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#D6A63A]/30 text-xs text-[#667085] space-y-2">
          <span className="text-[#946708] font-bold uppercase text-[10px] block tracking-wider">Quick Fill Credentials:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@grandluckydraw.com');
                setPassword('Password@123');
              }}
              className="flex-1 py-1.5 rounded-lg bg-white border border-[#D6A63A]/40 text-[#946708] text-[11px] font-bold hover:bg-[#FAF7EE] shadow-sm"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('officer@grandluckydraw.com');
                setPassword('Password@123');
              }}
              className="flex-1 py-1.5 rounded-lg bg-white border border-[#D6A63A]/40 text-[#946708] text-[11px] font-bold hover:bg-[#FAF7EE] shadow-sm"
            >
              Draw Officer
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold uppercase text-[#172033] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D6A63A]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-xs focus:outline-none focus:border-[#D6A63A] focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase text-[#172033] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D6A63A]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-xs focus:outline-none focus:border-[#D6A63A] focus:bg-white"
            />
          </div>

          {requires2FA && (
            <div className="space-y-1">
              <label className="font-bold uppercase text-[#946708] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D6A63A]" />
                <span>2FA Code (Enter 123456)</span>
              </label>
              <input
                type="text"
                required
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border border-[#D6A63A]/50 text-[#172033] font-mono text-sm focus:outline-none focus:border-[#D6A63A] text-center"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#172033]" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-[#667085] hover:text-[#172033] font-medium">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
