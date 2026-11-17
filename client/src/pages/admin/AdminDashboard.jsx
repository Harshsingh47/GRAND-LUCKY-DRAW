import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Gift,
  Award,
  Lock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/campaigns/stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setCharts(res.data.charts);
        }
      } catch (err) {
        console.error('[Admin Dashboard Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-gold-400 font-mono">Loading campaign intelligence...</div>;
  }

  const statCards = [
    { label: 'Total Registered', value: stats?.totalRegistered || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Mobile Verified', value: stats?.verifiedParticipants || 0, icon: UserCheck, color: 'text-emerald-400' },
    { label: 'Pending Registrations', value: stats?.pendingRegistrations || 0, icon: Clock, color: 'text-yellow-400' },
    { label: 'Eligible for Draw', value: stats?.eligibleParticipants || 0, icon: ShieldCheck, color: 'text-gold-400' },
    { label: 'Disqualified', value: stats?.disqualifiedParticipants || 0, icon: UserX, color: 'text-red-400' },
    { label: 'Total Grand Prizes', value: stats?.totalPrizes || 70, icon: Gift, color: 'text-purple-400' },
    { label: 'Winners Assigned', value: stats?.totalWinners || 0, icon: Award, color: 'text-amber-400' },
    { label: 'Published Winners', value: stats?.publishedWinners || 0, icon: CheckSquare, color: 'text-green-400' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            CAMPAIGN <span className="text-gold-gradient">OVERVIEW</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time telemetry and management controls for Grand Lucky Draw 2027.
          </p>
        </div>

        {/* Current Draw Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-gray-400 font-mono">Campaign State:</span>
          <span className="px-3 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 font-mono font-bold text-xs">
            {stats?.campaignStatus || 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Manual Draw Alert Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-gold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              Manual Draw Management Protocol
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Official draw is conducted physically outside the system. When registrations close, freeze the participant list in Step 2 to generate the cryptographic SHA-256 hash.
            </p>
          </div>
        </div>
        <Link
          to="/admin/draw-management"
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-gold-glow"
        >
          Manage Draw Stages →
        </Link>
      </div>

      {/* 8 Stat Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/40 transition-all space-y-2 shadow-card-dark"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {card.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Panel */}
        <div className="luxury-card rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Quick Administrative Actions</h3>
          <div className="space-y-2.5">
            <Link
              to="/admin/draw-management"
              className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gold-500/20 hover:border-gold-500/50 text-xs font-semibold text-gray-200 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-gold-400" />
                <span>Close Registration & Freeze List</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
            </Link>

            <Link
              to="/admin/enter-winners"
              className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gold-500/20 hover:border-gold-500/50 text-xs font-semibold text-gray-200 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-gold-400" />
                <span>Enter Manual Winners</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
            </Link>

            <Link
              to="/admin/winner-approvals"
              className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gold-500/20 hover:border-gold-500/50 text-xs font-semibold text-gray-200 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-gold-400" />
                <span>Two-Person Approvals Queue</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
            </Link>

            <Link
              to="/admin/winners"
              className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gold-500/20 hover:border-gold-500/50 text-xs font-semibold text-gray-200 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-gold-400" />
                <span>Publish Official Results</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
            </Link>

            <Link
              to="/admin/participants"
              className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gold-500/20 hover:border-gold-500/50 text-xs font-semibold text-gray-200 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-gold-400" />
                <span>Export Participants (Excel / CSV)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
            </Link>
          </div>
        </div>

        {/* State Breakdown Card */}
        <div className="lg:col-span-2 luxury-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Top Participant Regions</h3>
            <span className="text-xs text-gold-400 font-mono">Geographic Distribution</span>
          </div>

          <div className="space-y-3 pt-2">
            {charts?.stateBreakdown && charts.stateBreakdown.length > 0 ? (
              charts.stateBreakdown.map((item, idx) => {
                const max = charts.stateBreakdown[0]?.count || 1;
                const percent = Math.round((item.count / max) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-300">{item._id || 'Unspecified'}</span>
                      <span className="text-gold-300 font-mono">{item.count} entries</span>
                    </div>
                    <div className="h-2 rounded-full bg-dark-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-500">No regional data recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
