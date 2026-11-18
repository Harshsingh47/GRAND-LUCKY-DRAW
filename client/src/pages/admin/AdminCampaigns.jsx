import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Save,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Users,
  CheckCircle2,
  Lock
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminCampaigns = () => {
  const { showToast } = useToast();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    joiningStartDate: '',
    registrationClosingDate: '',
    drawDate: '',
    targetParticipants: 10000,
    isRegistrationActive: true,
    participationFeeEnabled: false,
    rules: ''
  });

  const fetchCampaign = async () => {
    try {
      const res = await api.get('/campaigns/active');
      if (res.data.success) {
        const c = res.data.data;
        setCampaign(c);
        setFormData({
          title: c.title || '',
          tagline: c.tagline || '',
          joiningStartDate: c.joiningStartDate ? c.joiningStartDate.split('T')[0] : '',
          registrationClosingDate: c.registrationClosingDate ? c.registrationClosingDate.split('T')[0] : '',
          drawDate: c.drawDate ? c.drawDate.split('T')[0] : '',
          targetParticipants: c.targetParticipants || 10000,
          isRegistrationActive: !!c.isRegistrationActive,
          participationFeeEnabled: !!c.participationFeeEnabled,
          rules: Array.isArray(c.rules) ? c.rules.join('\n') : ''
        });
      }
    } catch (err) {
      showToast('Failed to load campaign settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaign?.id) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        tagline: formData.tagline.trim(),
        joiningStartDate: formData.joiningStartDate,
        registrationClosingDate: formData.registrationClosingDate,
        drawDate: formData.drawDate,
        targetParticipants: Number(formData.targetParticipants),
        isRegistrationActive: formData.isRegistrationActive,
        participationFeeEnabled: formData.participationFeeEnabled,
        rules: formData.rules.split('\n').map((r) => r.trim()).filter(Boolean)
      };

      const res = await api.put(`/campaigns/${campaign.id}`, payload);
      if (res.data.success) {
        showToast('Campaign configuration updated and recorded in audit log', 'success');
        fetchCampaign();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update campaign', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-[#8C610A] font-mono font-bold">Loading campaign configuration...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
          CAMPAIGN <span className="text-gold-gradient">SETTINGS</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Configure campaign timelines, target participants, rules, and compliance toggles.
        </p>
      </div>

      {/* Legal & Compliance Notice */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/50 flex items-start gap-4 shadow-sm">
        <ShieldCheck className="w-6 h-6 text-[#8C610A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#334155] space-y-1">
          <span className="font-bold text-[#0F172A] text-sm block">Legal Compliance Advisory</span>
          <p>
            Campaign dates, targets, and branding are dynamically configurable. Per legal directives, paid entry and payment processing remain disabled until confirmed with legal counsel.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E2E8F0]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#334155]">Campaign Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-sm font-semibold focus:outline-none focus:border-[#8C610A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#334155]">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-sm font-serif italic focus:outline-none focus:border-[#8C610A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#334155]">Joining Start Date</label>
              <input
                type="date"
                required
                value={formData.joiningStartDate}
                onChange={(e) => setFormData({ ...formData, joiningStartDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#8C610A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#334155]">Registration Closing Date</label>
              <input
                type="date"
                required
                value={formData.registrationClosingDate}
                onChange={(e) => setFormData({ ...formData, registrationClosingDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#8C610A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#8C610A]">Official Draw Date (19 May)</label>
              <input
                type="date"
                required
                value={formData.drawDate}
                onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/60 text-[#8C610A] text-sm focus:outline-none focus:border-[#8C610A] font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#334155]">Target Participants</label>
              <input
                type="number"
                min="100"
                required
                value={formData.targetParticipants}
                onChange={(e) => setFormData({ ...formData, targetParticipants: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-sm font-mono font-bold focus:outline-none focus:border-[#8C610A]"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">Active Public Registration</span>
                <span className="text-xs text-[#64748B]">Allow users to register and generate participant IDs</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isRegistrationActive}
                onChange={(e) => setFormData({ ...formData, isRegistrationActive: e.target.checked })}
                className="w-5 h-5 accent-[#8C610A] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer border-t border-[#E2E8F0] pt-3">
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">Participation Entry Fee Gate</span>
                <span className="text-xs text-[#64748B]">Requires formal legal review before activating</span>
              </div>
              <input
                type="checkbox"
                checked={formData.participationFeeEnabled}
                onChange={(e) => setFormData({ ...formData, participationFeeEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#8C610A] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Campaign Rules */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[#334155]">
              Participation Rules (One per line)
            </label>
            <textarea
              rows={4}
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#8C610A] leading-relaxed font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold px-8 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4 text-[#0F172A]" />
              <span>{submitting ? 'Updating...' : 'Save Campaign Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCampaigns;
