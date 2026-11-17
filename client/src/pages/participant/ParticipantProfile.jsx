import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, MapPin, Calendar, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ParticipantProfile = () => {
  const { participant } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    dateOfBirth: '',
    city: '',
    state: '',
    address: '',
    participantId: '',
    isEligible: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (participant) {
      setFormData({
        fullName: participant.fullName || '',
        mobile: participant.mobile || '',
        email: participant.email || '',
        dateOfBirth: participant.dateOfBirth ? participant.dateOfBirth.split('T')[0] : '',
        city: participant.city || '',
        state: participant.state || '',
        address: participant.address || '',
        participantId: participant.participantId || '',
        isEligible: participant.isEligible !== false
      });
    }
  }, [participant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/participants/profile', {
        email: formData.email,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth
      });

      if (res.data.success) {
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black font-heading text-white">
          MY <span className="text-gold-gradient">PROFILE</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review your registration details. Permitted contact information can be updated below.
        </p>
      </div>

      {/* Non-modifiable System Badges */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/30 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Locked Registration Credentials (Non-Modifiable)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-dark-950 border border-gray-800">
            <span className="text-gray-500 block mb-1">Participant ID</span>
            <span className="text-base font-bold text-gold-300">{formData.participantId || 'LD2027-000001'}</span>
          </div>
          <div className="p-3 rounded-xl bg-dark-950 border border-gray-800">
            <span className="text-gray-500 block mb-1">Registered Mobile</span>
            <span className="text-sm font-bold text-white">+91 {formData.mobile}</span>
          </div>
          <div className="p-3 rounded-xl bg-dark-950 border border-gray-800">
            <span className="text-gray-500 block mb-1">Eligibility Status</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Eligible Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Editable Fields Form */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 shadow-card-dark">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-dark-950/60 border border-gray-800 text-gray-400 text-sm cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-500">Legal name registered on entry pass</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">City / District</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Residential Address</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Your residential street / colony address"
              className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-gold-glow"
          >
            <Save className="w-4 h-4 text-dark-950" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParticipantProfile;
