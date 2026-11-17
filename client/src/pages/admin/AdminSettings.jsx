import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Bell,
  Lock,
  Database,
  Save,
  CheckCircle2,
  Send,
  Download
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const AdminSettings = () => {
  const { showToast } = useToast();
  const [testMobile, setTestMobile] = useState('9810123456');
  const [testSending, setTestSending] = useState(false);

  const handleTestSms = async (e) => {
    e.preventDefault();
    setTestSending(true);
    try {
      const res = await api.post('/auth/participant/request-otp', {
        mobile: testMobile,
        purpose: 'test'
      });
      if (res.data.success) {
        showToast(`Test SMS dispatched! Test code: ${res.data.debugOtp || '123456'}`, 'success');
      }
    } catch (err) {
      showToast('Failed to send test SMS', 'error');
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
          SYSTEM <span className="text-gold-gradient">SETTINGS</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Platform configurations, legal safety toggles, SMS simulation, and database security.
        </p>
      </div>

      {/* Legal & Regulatory Status Card */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-4 shadow-card-dark">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">Legal & Compliance Model</h3>
            <p className="text-xs text-gray-400">Official Regulatory Guidelines</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-dark-950 border border-gold-500/30 space-y-2 text-xs text-gray-300 leading-relaxed">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero-Fee Promotional Entry Enforced</span>
          </div>
          <p>
            Paid participation gates and payment gateways are intentionally disabled in compliance with Indian promotional campaign regulations. Any change to the participation model requires documented legal certification.
          </p>
        </div>
      </div>

      {/* SMS Gateway & Simulator Card */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">SMS & Notification Gateway</h3>
            <p className="text-xs text-gray-400">Test live transmission and verification dispatch</p>
          </div>
        </div>

        <form onSubmit={handleTestSms} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-300">
              Test Mobile Number (10 Digits)
            </label>
            <div className="flex gap-3">
              <input
                type="tel"
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                maxLength={10}
                required
                className="flex-1 px-4 py-2.5 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-xs font-mono focus:outline-none focus:border-gold-400"
              />
              <button
                type="submit"
                disabled={testSending}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-gold-glow"
              >
                <Send className="w-4 h-4 text-dark-950" />
                <span>{testSending ? 'Sending...' : 'Dispatch Test OTP'}</span>
              </button>
            </div>
          </div>
          <span className="text-[11px] text-gray-500 block">
            Pluggable SMS Gateway: Currently configured with real-time notification logging and developer mock responses.
          </span>
        </form>
      </div>

      {/* Database & Backup Card */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">Database & Backup Archives</h3>
            <p className="text-xs text-gray-400">MongoDB database status and export archives</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-dark-950 border border-gray-800 text-xs font-mono">
          <div>
            <span className="text-gray-400 block">Target Participants Capacity:</span>
            <span className="text-gold-300 font-bold text-sm">10,000 Entries (Atomic IDs)</span>
          </div>
          <a
            href="/api/participants/export/download?format=xlsx"
            target="_blank"
            className="btn-outline-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>Download Full Database Dump (Excel)</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
