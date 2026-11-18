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
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
          SYSTEM <span className="text-gold-gradient">SETTINGS</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Platform configurations, legal safety toggles, SMS simulation, and database security.
        </p>
      </div>

      {/* Legal & Regulatory Status Card */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-[#8C610A]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] font-heading">Legal & Compliance Model</h3>
            <p className="text-xs text-[#64748B]">Official Regulatory Guidelines</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/40 space-y-2 text-xs text-[#334155] leading-relaxed">
          <div className="flex items-center gap-2 text-[#047857] font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#047857]" />
            <span>Zero-Fee Promotional Entry Enforced</span>
          </div>
          <p>
            Paid participation gates and payment gateways are intentionally disabled in compliance with Indian promotional campaign regulations. Any change to the participation model requires documented legal certification.
          </p>
        </div>
      </div>

      {/* SMS Gateway & Simulator Card */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-[#8C610A]">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] font-heading">SMS & Notification Gateway</h3>
            <p className="text-xs text-[#64748B]">Test live transmission and verification dispatch</p>
          </div>
        </div>

        <form onSubmit={handleTestSms} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[#334155]">
              Test Mobile Number (10 Digits)
            </label>
            <div className="flex gap-3">
              <input
                type="tel"
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                maxLength={10}
                required
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs font-mono font-bold focus:outline-none focus:border-[#8C610A]"
              />
              <button
                type="submit"
                disabled={testSending}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4 text-[#0F172A]" />
                <span>{testSending ? 'Sending...' : 'Dispatch Test OTP'}</span>
              </button>
            </div>
          </div>
          <span className="text-[11px] text-[#64748B] block">
            Pluggable SMS Gateway: Currently configured with real-time notification logging and developer mock responses.
          </span>
        </form>
      </div>

      {/* Database & Backup Card */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-[#8C610A]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] font-heading">Database & Backup Archives</h3>
            <p className="text-xs text-[#64748B]">MongoDB database status and export archives</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-xs font-mono">
          <div>
            <span className="text-[#64748B] block text-[11px] font-sans">Target Participants Capacity:</span>
            <span className="text-[#8C610A] font-bold text-sm block mt-0.5">10,000 Entries (Atomic IDs)</span>
          </div>
          <a
            href="/api/participants/export/download?format=xlsx"
            target="_blank"
            className="btn-outline-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#8C610A]" />
            <span>Download Full Database Dump (Excel)</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
