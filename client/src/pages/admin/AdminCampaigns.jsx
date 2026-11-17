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
    return <div className="p-8 text-gold-400 font-mono">Loading campaign configuration...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
          CAMPAIGN <span className="text-gold-gradient">SETTINGS</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Configure campaign timelines, target participants, rules, and compliance toggles.
        </p>
      </div>

      {/* Legal & Compliance Notice */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/30 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 space-y-1">
          <span className="font-bold text-white text-sm block">Legal Compliance Advisory</span>
          <p>
            Campaign dates, targets, and branding are dynamically configurable. Per legal directives, paid entry and payment processing remain disabled until confirmed with legal counsel.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 shadow-card-dark">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-300">Campaign Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-300">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400 font-serif italic"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-300">Joining Start Date</label>
              <input
                type="date"
                required
                value={formData.joiningStartDate}
                onChange={(e) => setFormData({ ...formData, joiningStartDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-300">Registration Closing Date</label>
              <input
                type="date"
                required
                value={formData.registrationClosingDate}
                onChange={(e) => setFormData({ ...formData, registrationClosingDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gold-400">Official Draw Date (19 May)</label>
              <input
                type="date"
                required
                value={formData.drawDate}
                onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/40 text-gold-300 text-sm focus:outline-none focus:border-gold-400 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-300">Target Participants</label>
              <input
                type="number"
                min="100"
                required
                value={formData.targetParticipants}
                onChange={(e) => setFormData({ ...formData, targetParticipants: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm font-mono focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-bold text-white block">Active Public Registration</span>
                <span className="text-xs text-gray-400">Allow users to register and generate participant IDs</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isRegistrationActive}
                onChange={(e) => setFormData({ ...formData, isRegistrationActive: e.target.checked })}
                className="w-5 h-5 accent-gold-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer border-t border-gray-800 pt-3">
              <div>
                <span className="text-sm font-bold text-white block">Participation Entry Fee Gate</span>
                <span className="text-xs text-gray-500">Requires formal legal review before activating</span>
              </div>
              <input
                type="checkbox"
                checked={formData.participationFeeEnabled}
                onChange={(e) => setFormData({ ...formData, participationFeeEnabled: e.target.checked })}
                className="w-5 h-5 accent-gold-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Campaign Rules */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-300">
              Participation Rules (One per line)
            </label>
            <textarea
              rows={4}
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-xs focus:outline-none focus:border-gold-400 leading-relaxed font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold px-8 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-gold-glow"
            >
              <Save className="w-4 h-4 text-dark-950" />
              <span>{submitting ? 'Updating...' : 'Save Campaign Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCampaigns;
