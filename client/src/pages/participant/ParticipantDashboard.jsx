import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Bell,
  ArrowRight,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CountdownTimer from '../../components/CountdownTimer';
import api from '../../services/api';

const ParticipantDashboard = () => {
  const { participant } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campRes, annRes] = await Promise.all([
          api.get('/campaigns/active'),
          api.get('/announcements')
        ]);
        if (campRes.data.success) setCampaign(campRes.data.data);
        if (annRes.data.success) setAnnouncements(annRes.data.data);
      } catch (err) {
        console.error('[Dashboard Error]', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-gold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card-dark">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5" />
            <span>Official Participant Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Welcome back, <span className="text-gold-gradient">{participant?.fullName}</span>
          </h1>
          <p className="text-sm text-gray-400">
            Registered on{' '}
            {participant?.registrationDate
              ? new Date(participant.registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Official Campaign'}
          </p>
        </div>

        {/* Participant ID Badge */}
        <div className="p-5 rounded-2xl bg-dark-950 border-2 border-gold-500/50 text-center min-w-[240px] shadow-gold-glow">
          <span className="text-[10px] uppercase font-bold text-gold-300 tracking-widest block mb-1">
            Unique Participant ID
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-gold-gradient tracking-wider block">
            {participant?.participantId || 'LD2027-000001'}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold inline-flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified & Eligible Entry</span>
          </span>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/participant/participation"
          className="p-6 rounded-2xl luxury-card hover:border-gold-500/60 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400 w-fit group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-heading">Digital Lucky Draw Pass</h3>
          <p className="text-xs text-gray-400">View and print your official pass with security QR code.</p>
          <span className="text-xs text-gold-400 font-semibold flex items-center gap-1">
            <span>Open Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/participant/profile"
          className="p-6 rounded-2xl luxury-card hover:border-gold-500/60 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400 w-fit group-hover:scale-110 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-heading">My Profile</h3>
          <p className="text-xs text-gray-400">Update permitted contact info and delivery preferences.</p>
          <span className="text-xs text-gold-400 font-semibold flex items-center gap-1">
            <span>Manage Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/winners"
          className="p-6 rounded-2xl luxury-card hover:border-gold-500/60 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400 w-fit group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-heading">Official Results</h3>
          <p className="text-xs text-gray-400">Check officially published winners from the manual draw.</p>
          <span className="text-xs text-gold-400 font-semibold flex items-center gap-1">
            <span>View Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/verify-winner"
          className="p-6 rounded-2xl luxury-card hover:border-gold-500/60 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400 w-fit group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-heading">Prize Claim Verification</h3>
          <p className="text-xs text-gray-400">Verify winner status and submit claim documents.</p>
          <span className="text-xs text-gold-400 font-semibold flex items-center gap-1">
            <span>Check & Claim</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Countdown Card */}
      <div className="luxury-card rounded-3xl p-8 shadow-card-dark">
        <CountdownTimer
          targetDate={campaign?.drawDate || '2027-05-19T10:00:00.000Z'}
          label="Official Physical Draw Countdown • 19 May"
        />
      </div>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gold-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              Official Campaign Updates
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 4).map((ann) => (
              <div key={ann._id} className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="text-gold-400 font-semibold uppercase">{ann.category}</span>
                  <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-base font-bold text-white">{ann.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantDashboard;
